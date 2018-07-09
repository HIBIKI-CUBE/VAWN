const Formatter = require("./Formatter");
const fs = require("fs");

const talk = JSON.parse(fs.readFileSync('./data/talk.json', 'utf8'));

module.exports = function talkFnc (mstdn, tootInfo, tootVis) {
	for (let i = 0; i < talk.notice.length; i++) {
		if (tootInfo.tootContent.match(new RegExp(talk.notice[i]))) {
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.response[i][Math.floor(Math.random() * talk.response[i].length)]
				].join("\r\n"),

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			return;
		}
	}

	mstdn.post("statuses", {
		status: [
			`@${tootInfo.tooter}からVAWNへのメンションを確認しました。`,
			"コマンドを正しく認識できなかったため処理が行えませんでした。申し訳ありません。",
			"",
			"現在VAWNが対応しているコマンドについては、以下を参照してください。",
			"https://vawn.herokuapp.com/next/"
		].join("\r\n"),

		visibility: tootVis,
		in_reply_to_id: tootInfo.tootId
	});
}