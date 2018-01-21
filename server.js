const express = require("express");
const fs = require("fs");
const Mastodon = require("mastodon-api");
const scrape = require('cheerio-httpcli');

const Formatter = require("./funcs/Formatter");
const Dice = require("./funcs/Dice");
const Janken = require("./funcs/Janken");
const talkFnc = require("./funcs/talk-fnc");

const packageInfo = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

let mstdn = new Mastodon({
	api_url: "https://happy-oss.y-zu.org/api/v1/",
	access_token: "013dc0d18135f043436671e2e8fb52573f27a3fb8f97951845633cd9d649aaa1"
});

let stream = mstdn.stream("streaming/user");
	stream.on("message", toot => {
		if (toot.event == "notification" && toot.data.type == "mention") {
			let tootInfo = Formatter.getInfoFromToot(toot);
			let tootVis = "public";
			tootVis = toot.data.status.visibility;

			console.log(`${tootInfo.tooter} … ${tootInfo.tootContent},${tootVis}`);
			
			if (tootInfo.tootContent.toUpperCase().match(/@VAWN/g)) {
				let variables = [];
				
				switch (true) {
					default:
						talkFnc(mstdn,tootInfo,tootVis);
						break;

					case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/(?:あなた|きみ|君|おまえ|お前|VAWN(?:| ))の(?:親|父親)/)):
						mstdn.post("statuses", {
							status: [
								`@${tootInfo.tooter}`,
								"私を作ってくれたのは私を使ってくださったみなさんです！"
							].join("\r\n"),

							visibility: tootVis,
							in_reply_to_id: tootInfo.tootId
						});

						break;

					case !!(tootInfo.tootContent.match(/サイコロ|さいころ|ダイス/)):
						mstdn.post("statuses", {
							status: [
								`@${tootInfo.tooter}`,
								`${Math.floor(Math.random() * 5 + 1)}が出ました。`
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
								"",
								`${vawnAct}！`,
								`あなたは${playerAct}を出したので、`,
								`${state}です！！`
							].join("\r\n"),

							visibility: tootVis,
							in_reply_to_id: tootInfo.tootId
						});

						break;

					case !!(variables = Formatter.mentionRemove(tootInfo.tootContent).match(/(.*) (とは|#とは|って|を検索|をググ|をぐぐ)/)):
						scrape.fetch('https://google.co.jp/search', { q: variables[1] }, (err, $) => {
							let ans = $('#rso ._OKe ._oDd span').text();
							let ans2 = $('#rhs_block ._OKe ._G1d').text();
							
							mstdn.post("statuses", {
								status: [
									`@${tootInfo.tooter}`,
									`${ans} ${ans2}`,
									"",
									`詳細はこちらのページをご覧下さい。`,
									`https://google.co.jp/search?q=${encodeURIComponent(variables[1]+'とは')}`
								].join("\r\n"),
	
								visibility: tootVis,
								in_reply_to_id: tootInfo.tootId
							});
						});

						break;

					case !!(variables = Formatter.mentionRemove(tootInfo.tootContent).match(/(.*) (計算|解いて|は|の答え)/)):
						scrape.fetch('https://search.yahoo.co.jp/search', { p: variables[1] }, (err, $) => {
							let ans = $('#mIn .ist').text();
							
							mstdn.post("statuses", {
								status: [
									`@${tootInfo.tooter}`,
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

					case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match('debug toot')):
					console.log(JSON.stringify(toot));
						mstdn.post("statuses", {
							status: [
								`@${tootInfo.tooter}`,
								`${JSON.stringify(toot,undefined,1)}`
							].join("\r\n"),

							visibility: tootVis,
							in_reply_to_id: tootInfo.tootId
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
	})
});