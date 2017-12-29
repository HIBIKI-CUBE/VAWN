const express = require("express");
const htmlToText = require("html-to-text");
const Mastodon = require("mastodon-api");


//Set Mastodon API for mstdn.Y-zu.org
let mstdn = new Mastodon({
	api_url: "https://vawn.m.to/api/v1/",
	access_token: "58bd8dc1b9703c4e6759492841925e4ee35946d4590386f46c646b7696fc95bd"
});

let stream = mstdn.stream("streaming/user");
	stream.on("message", msg => {
		let from = msg.data.account.acct;
		let msgId = msg.data.id;
		let content = htmlToText.fromString(msg.data.content);
		
		//console.log(msg.data);
		console.log(`${from} … ${content}`);
		
		if (content.toUpperCase().match(/@VAWN/g)) {
			let result = "";
			
			if (result = content.match(/(@.+) に(\d+)YZUを(与える|あげる|渡す|わたす)/)) {
				console.log(result);
				mstdn.post("statuses", { status: `@${from} が` });
			} else if (result = content.match(/(サイコロ|さいころ)(ふって|振って|振れ|ふれ|やって||)/)) {
				console.log(result);
				let dice = Math.floor(Math.random()*5)+1;
				mstdn.post("statuses", { status: `${dice}が出ました。`, visibility: "unlisted", in_reply_to_id: msgId });
			} else if (result = content.match(/(あなた|きみ|君|おまえ|お前|VAWN||)の(親|父親)(は||)/)) {
				console.log(result);
				mstdn.post("statuses", { status: `@${from} 私を作ってくれたのは私を使ってくださったみなさんです！`, visibility: "unlisted", in_reply_to_id: msgId });
			} else {
				mstdn.post("statuses", { status: [
				`@${from}`+"からVAWNへのメンションを確認しました。",
				"コマンドを正しく認識できなかったため処理が行えませんでした。申し訳ありません。",
				"現在VAWNが対応しているコマンドについては、以下を参照してください。",
				"https://vawn.glitch.me/"
				].join("\r\n"), visibility: "unlisted", in_reply_to_id: msgId });
			}
		}
	});
	
let app = express();
	app.use(express.static('views'));
	
	app.get("/", (req, res) => {
		res.sendFile(`${__dirname}/views/`);
	});
	
let listener = app.listen(process.env.PORT, function () {
	console.log(`[VAWN] I'm running on port ${listener.address().port}!!`);
});