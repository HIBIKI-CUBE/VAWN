const express = require("express");
const fs = require("fs");
const Mastodon = require("mastodon-api");
const scrape = require('cheerio-httpcli');
const webshot = require('webshot');
const fb = require("firebase-admin");

const Formatter = require("./funcs/Formatter");
const Dice = require("./funcs/Dice");
const Janken = require("./funcs/Janken");
const talkFnc = require("./funcs/talk-fnc");

const packageInfo = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const dt = new Date();

let mstdn = new Mastodon({
	api_url: "https://mstdn.y-zu.org/api/v1/",
	access_token: process.env.NODE_YZU
});

/*const serviceAccount = JSON.parse(process.env.NODE_FIREBASE);

fb.initializeApp({
	credential: fb.credential.cert(serviceAccount),
	databaseURL: "https://vawn-yzu.firebaseio.com"
});*/

let stream = mstdn.stream("streaming/user");
	stream.on("message", toot => {
		if (toot.event == "notification" && toot.data.type == "mention") {
			let tootInfo = Formatter.getInfoFromToot(toot);
			let tootVis = tootInfo.tootVisibility;
			let qna = new Object();

			console.log(`${tootInfo.tooter} … ${tootInfo.tootContent}, ${tootVis}`);

			if (tootInfo.tootContent.toUpperCase().match(/@VAWN/g)) {
				let variables = [];

				scrape.set('browser', 'chrome');
				scrape.set('debug', true);

				switch (true) {
					default: talkFnc(mstdn, tootInfo, tootVis);
					break;

					case !!(tootInfo.tootContent.match(/サイコロ|さいころ|ダイス/)):
						mstdn.post("statuses", {
							status: [
								`@${tootInfo.tooter}`,
								Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),

								`${Math.floor(Math.random() * 5 + 1)}が出ました。`
							].join("\r\n"),

							visibility: tootVis,
							in_reply_to_id: tootInfo.tootId
						});

						break;

					case !!(tootInfo.tootContent.match(/コイン/)):
							let coin = "";

						if (Math.round(Math.random())) {
							coin = "おもて";
						} else {
							coin = "うら";
						}

						mstdn.post("statuses", {
							status: [
								`@${tootInfo.tooter}`,
								`${coin}が出ました。`
							].join("\r\n"),

							visibility: tootVis,
							in_reply_to_id: tootInfo.tootId
						});

						break;

					case !!(variables = tootInfo.tootContent.match(/(?:じゃんけん|ジャンケン)(グー|グ〜|ぐー|ぐ～|チョキ|ちょき|パー|パ〜|ぱー|ぱ～)/)):
						let playerAct = variables[1] || "グー";

						let vawnActId = Math.floor(Math.random() * 2);
						let vawnAct = Janken.ACTIONS[vawnActId];

						let state = Janken.getState(Janken.detectAction(playerAct), vawnActId);

						mstdn.post("statuses", {
							status: [
								`@${tootInfo.tooter}`,
								Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),
								"",
								`${vawnAct}！`,
								`あなたは${playerAct}を出したので、`,
								`${state}です！！`
							].join("\r\n"),

							visibility: tootVis,
							in_reply_to_id: tootInfo.tootId
						});

						break;

					case !!(tootInfo.tootContent.match(/時/)):
						dt.setTime(dt.getTime() + 32400000);

						let hour = dt.getHours();
						let min = dt.getMinutes();

						if (hour < 10) {
							hour = '0' + hour;
						}
						if (min < 10) {
							min = '0' + min;
						}

						mstdn.post("statuses", {
							status: [
								`@${tootInfo.tooter}`,
								`現在の時刻は`,
								`${hour+':'+min}`,
								`です。`
							].join("\r\n"),

							visibility: tootVis,
							in_reply_to_id: tootInfo.tootId
						});

						break;

					case !!(variables = tootInfo.tootContent.match(/あっ?、(.*)(?=！$)/)):
						let content = Formatter.Suumo.generate(variables[1]);

						mstdn.post("statuses", {
							status: [
								`@${tootInfo.tooter}`,
								Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),

								content
							].join("\r\n"),

							visibility: tootVis,
							in_reply_to_id: tootInfo.tootId
						});

						break;

					case !!(variables = Formatter.mentionRemove(tootInfo.tootContent).match(/(.*) (とは|#とは|って|を検索|をググ)/)):
						/*
						scrape.set('browser','iphone');
						scrape.fetch('https://google.co.jp/search', { q: encodeURIComponent(variables[1]), hl: 'ja', lr: 'lang_ja' }, (err, $) => {
							let ans = Formatter.googleRemove($('#rso ._NId:first-child .lr_container').text());
							let ans2 = Formatter.googleRemove($('#rso ._Tgc._s8w').text());
							let ans3 = Formatter.googleRemove($('div.kp-body>div._G1d._wle._xle').text());

							console.log(JSON.stringify(ans, null, "\t"));
							console.log(JSON.stringify(ans2, null, "\t"));
							console.log(JSON.stringify(ans3, null, "\t"));

							mstdn.post("statuses", {
								status: [
									`@${tootInfo.tooter}`,
									Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),

									`${ans},${ans2},${ans3}`,
									"",
									`詳細はこちらのページをご覧下さい。`,
									`https://google.co.jp/search?q=${encodeURIComponent(variables[1]+'とは')}`
								].join("\r\n"),

								visibility: tootVis,
								in_reply_to_id: tootInfo.tootId
							});
						});
						scrape.set('browser','chrome');*/

						break;

					case !!(variables = Formatter.mentionRemove(tootInfo.tootContent).match(/(.*) (とは|#とは|って|を検索|をググ)/)):
						mstdn.post("statuses", {
							status: [
								`@${tootInfo.tooter}`,
								Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),

								"クイック検索は現在次期バージョンを開発しています。",
								"リリースまで今しばらくお待ちください。",
								"ご迷惑をおかけし、申し訳ありません。",
								"",
								"よろしければこちらのリンクをご利用ください。",
								`https://google.co.jp/search?q=${encodeURIComponent(variables[1]+'とは')}`
							].join("\r\n"),

							visibility: tootVis,
							in_reply_to_id: tootInfo.tootId
						});

						scrape.set('browser', 'chrome');
						break;

					case !!(variables = Formatter.mentionRemove(tootInfo.tootContent).match(/debug google (.*) (.*)/)):
						scrape.fetch('https://google.co.jp/search', {
							q: encodeURIComponent(variables[1]),
							hl: 'ja',
							lr: 'lang_ja'
						}, (err, $) => {
							let ans = Formatter.googleRemove($(variables[2]).text());
							console.log(JSON.stringify(ans, null, "\t"));

							mstdn.post("statuses", {
								status: [
									`@${tootInfo.tooter}`,
									Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),

									`${ans}`,
									"",
									`詳細はこちらのページをご覧下さい。`,
									`https://google.co.jp/search?q=${encodeURIComponent(variables[1]+'とは')}`
								].join("\r\n"),

								visibility: tootVis,
								in_reply_to_id: tootInfo.tootId
							});
						});

						break;

					case !!(variables = tootInfo.tootContent.match(/TPDランキング/)):
						scrape.fetch("http://vinayaka.distsn.org/cgi-bin/vinayaka-user-speed-api.cgi", {
							1000: ""
						}, (err, $) => {
							let list = JSON.parse($.text());

							let rank = 0,
								me = list.find((user, index) => {
									if (`${user.username}@${user.host}` == tootInfo.tooter) {
										rank = index + 1;
										return true;
									}
								});

							if (me) {
								mstdn.post("statuses", {
									status: [
										`@${tootInfo.tooter}`,
										Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),

										`あなたは${rank}位です。`
									].join("\r\n"),

									visibility: tootVis,
									in_reply_to_id: tootInfo.tootId
								});
							} else {
								mstdn.post("statuses", {
									status: [
										`@${tootInfo.tooter}`,
										Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),
										"1000位以内に見つかりませんでした。"
									].join("\r\n"),

									visibility: tootVis,
									in_reply_to_id: tootInfo.tootId
								});
							}
						});

						break;

					case !!(variables = Formatter.mentionRemove(tootInfo.tootContent).match(/(.*) (計算|解いて|は|の答え)/)):
						scrape.fetch('https://search.yahoo.co.jp/search', {
							p: variables[1]
						}, (err, $) => {
							let ans = $('#mIn .ist').text();

							mstdn.post("statuses", {
								status: [
									`@${tootInfo.tooter}`,
									Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),

									`${ans}`,
									"",
									`詳細はこちらのページをご覧下さい。`,
									`https://google.com/search?q=${encodeURIComponent(variables[1])}`
								].join("\r\n"),

								visibility: tootVis,
								in_reply_to_id: tootInfo.tootId
							});
						});

						break;

					case !!(variables = Formatter.mentionRemove(tootInfo.tootContent).match(/(?:(.+) ?の)?ニュース/)):
						const AMOUNT = 10;

						scrape.set('headers', { 'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1" });

						new Promise(resolve => {
							const articles = [];
							const links = [];

							if (!variables[1]) {
								scrape.fetch('https://news.yahoo.co.jp/list/').then(res => {
									const { $ } = res;

									$('#wrapper > article.listArea ul.topicsList dt').each((index, article) => articles.unshift($(article).text()));
									$('#wrapper > article.listArea ul.topicsList a').each((index, article) => links.unshift($(article).attr('href')));
	
									articles[AMOUNT] = "";
								}).then(() => resolve({ articles, links }));
							} else {
								variables[1] = variables[1].trimRight();

								scrape.fetch('https://news.yahoo.co.jp/search/', { p: encodeURIComponent(variables[1]) }).then(res => {
									const { $ } = res;

									$('#NSm > div > h2 > a').each((index, article) => {
										articles.unshift($(article).text());
										links.unshift($(article).attr('href'));
									});
	
									articles[AMOUNT] = `search/?p=${encodeURIComponent(variables[1])}`;
								}).then(() => resolve({ articles, links }));
							}
						}).then(data => {
							const { articles, links } = data;

							mstdn.post("statuses", {
								status: [
									`@${tootInfo.tooter}`,
									Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),
									"こちらがニュースです。",
									"",
									(amount => {
										let headings = [];
										for (let i = 0; i < amount; i++) headings.push(`${i + 1}. ${articles[i]}`);
	
										return headings.join("\r\n");
									})(AMOUNT),
									"",
									"各記事へのリンクの一覧が続きます。"
								].join("\r\n"),
	
								visibility: tootVis,
								in_reply_to_id: tootInfo.tootId
							}).then(res => {
								mstdn.post("statuses", {
									status: [
										`@${tootInfo.tooter}`,
										Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),
										"こちらが記事へのリンクです。",
										"",
										(amount => {
											let headings = [];
											for (let i = 0; i < amount; i++) headings.push(`${i + 1}. ${links[i]}`);
		
											return headings.join("\r\n");
										})(AMOUNT),
										"",
										`詳細はこちらのページをご覧下さい。`,
										`https://news.yahoo.co.jp/${articles[AMOUNT]}`
									].join("\r\n"),
	
									visibility: tootVis,
									in_reply_to_id: res.data.id
								});
							});
						});

						break;

					case !!(variables = Formatter.mentionRemove(tootInfo.tootContent).match(/(今日|きょう)は(何|なん|なに)の(日|ひ)/)):
						scrape.fetch('https://kids.yahoo.co.jp/today/', (err, $) => {
							let ans = $('#dateDtl').text();

							mstdn.post("statuses", {
								status: [
									`@${tootInfo.tooter}`,
									Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),

									`${ans}`,
									"",
									`詳細はこちらのページをご覧下さい。`,
									`https://kids.yahoo.co.jp/today/`
								].join("\r\n"),

								visibility: tootVis,
								in_reply_to_id: tootInfo.tootId
							});
						});

						break;

					case !!(variables = Formatter.mentionRemove(tootInfo.tootContent).match(/(.*) の(サポート|対応)状況/)):
						let coptions = {};

						webshot(`https://caniuse.com/#search=${encodeURIComponent(variables[1])}`, `./view/${tootInfo.tootId}.png`, coptions, err => {
							mstdn.post('media', {
								file: fs.createReadStream(`./view/${tootInfo.tootId}.png`)
							}).then(resp => {
								const id = resp.data.id;

								mstdn.post("statuses", {
									status: [
										`@${tootInfo.tooter}`,
										Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),
										"",
										`詳細はこちらのページをご覧下さい。`,
										`https://caniuse.com/#search=${encodeURIComponent(variables[1])}`
									].join("\r\n"),

									media_ids: [id],
									visibility: tootVis,
									in_reply_to_id: tootInfo.tootId
								});
							});
						});

						break;

					case !!(variables = Formatter.mentionRemove(tootInfo.tootContent).match(/(.*) の(値段|価格|お値段|相場)/)):
						let koptions = {
							cookies: "s_ptc=0.000%5E%5E0.000%5E%5E0.000%5E%5E0.000%5E%5E0.312%5E%5E0.153%5E%5E0.483%5E%5E0.036%5E%5E0.898; MalltagRoute=0ea60%2C%2C%2C%2C1519196823599; gpv_v59=%5Bksearch%5D%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%90%E3%83%AB%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C; s_cc=true; s_fid=2894C5BE6B89CED2-0D17167F8D0F7C1A; s_nr=1519196823603-New; s_royal=kakaku%3A801-2538947%3A1; s_sq=%5B%5BB%5D%5D; ASPSESSIONIDQCCCCQAT=CJDJHJGCGKJPJJDCCHIOGIKG; ASPSESSIONIDSADBCQBT=NPNMPIPBBMDIOHIHACABBLGD; ASPSESSIONIDSCABBTBT=LJEJIJMBFBIMOIFLDEAOKHDD; OX_plg=pm; OX_sd=2; kakakuusr=ps77uu6IcBO_1519196819629; ASPSESSIONIDAQTCCTBT=MINPENGCPDPNBOCIKJNIOGIJ; ASPSESSIONIDSCADCRBS=DCJNEJHCKIAJDNCCOOCBIPJD; pcpriority=1; ASPSESSIONIDQASCBQAR=PJKOCPLBHMEFBLCCGHOLLIDC; attentionBadge=0; s_vi=[CS]v1|2D468D410503409B-6000118A20007205[CE]; __gads=ID=47aff5be95668efe:T=1519196803:S=ALNI_MbH7oGOmMntLAKxju6lFtQtW6dmrQ; bd=bd7da0ff463345e58af308f147e651f8e"
						};

						webshot(`http://kakaku.com/search_results/${encodeURIComponent(variables[1])}/`, `./view/${tootInfo.tootId}.png`, koptions, err => {
							mstdn.post('media', {
								file: fs.createReadStream(`./view/${tootInfo.tootId}.png`)
							}).then(resp => {
								const id = resp.data.id;

								mstdn.post("statuses", {
									status: [
										`@${tootInfo.tooter}`,
										Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),
										"",
										`詳細はこちらのページをご覧下さい。`,
										`http://kakaku.com/search_results/${encodeURIComponent(variables[1])}/`
									].join("\r\n"),

									media_ids: [id],
									visibility: tootVis,
									in_reply_to_id: tootInfo.tootId
								});
							});
						});

						break;

					case !!(variables = tootInfo.tootContent.match(/debug (.*)/)):
						let args = variables[1].split(" ");

						switch (args[0]) {
							case "toot":
								console.log(toot);

								let contents = Formatter.splitByLength(JSON.stringify(toot), 500);
								contents.forEach(text => {
									mstdn.post("statuses", {
										status: [
											`@${tootInfo.tooter}`,
											Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),

											text
										].join("\r\n"),

										visibility: tootVis,
										in_reply_to_id: tootInfo.tootId
									});
								});

								break;

							case "eval":
								let result = eval(args.splice(1).join(" "));
								console.log(result);

								mstdn.post("statuses", {
									status: [
										`@${tootInfo.tooter}`,
										Formatter.getIdsFromTootMentions(tootInfo.mentions, "\r\n"),

										result
									].join("\r\n"),

									visibility: tootVis,
									in_reply_to_id: tootInfo.tootId
								});

								break;
						}

						break;

					case !!(variables = tootInfo.tootContent.match(/＠(.*)に(.*)(と|って)質問/)):
						let rep_ans = tootInfo.tootId;

						mstdn.post("statuses", {
							status: [
								`@${tootInfo.tooter}`,
								`＠${variables[1]}に`,
								variables[2],
								`と質問しました。`,
								`この質問は匿名で行われます。`
							].join("\r\n"),

							visibility: "direct",
							in_reply_to_id: tootInfo.tootId
						});

						mstdn.post("statuses", {
							status: [
								`@${variables[1]}`,
								`あなたに質問が届いています。`,
								``,
								variables[2],
								``,
								`このトゥートに以下のように返信すると直接回答できます。`,
								`回答 ${rep_ans} (本文内容)`,
								`この質問を不快に感じられた場合はこのトゥートに以下のように返信して下さい。`,
								`通報 ${rep_ans}`
							].join("\r\n"),

							visibility: "direct"
						});

						qna = {
							origin: tootInfo.tooter,
							to: variables[1],
							o_rep: tootInfo.tootId,
							q: variables[2]
						};

						fs.writeFile(`./data/${rep_ans}.json`, JSON.stringify(qna, null, '\t'));

						break;

					case !!(variables = tootInfo.tootContent.match(/回答 (\d+) (.*)/)):
						qna = JSON.parse(fs.readFileSync(`./data/${variables[1]}.json`, 'utf8'));

						mstdn.post("statuses", {
							status: [
								`@${tootInfo.tooter}`,
								`質問に対して`,
								`${variables[2]}`,
								`と回答しました。`,
								`これ以上やり取りが続くことはありません。`,
								`ありがとうございました。`
							].join("\r\n"),

							visibility: "direct",
							in_reply_to_id: tootInfo.tootId
						});

						mstdn.post("statuses", {
							status: [
								`@${qna.origin}`,
								`以下の質問に対して回答が届きました。`,
								``,
								`${qna.q}`,
								`${variables[2]}`,
								`これ以上やり取りを続けることはできません。`,
								`ご利用ありがとうございました。`
							].join("\r\n"),

							visibility: "direct",
							in_reply_to_id: variables[1]
						});

						break;
				}
			}
		}
	});

let app = express();
	app.use(express.static('view'));

	app.get("/", (req, res) => {
		res.sendFile(`${__dirname}/view/`);
	});

let listener = app.listen(process.env.PORT, function () {
	console.log(`[VAWN] I'm running on port ${listener.address().port}!!`);

	mstdn.post("statuses", {
		status: [
			`VAWNの起動が完了しました。コマンドの処理が可能です。`,
			`Version: ${packageInfo.version}`
		].join("\r\n"),

		visibility: "unlisted"
	});
});