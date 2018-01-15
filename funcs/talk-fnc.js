const Formatter = require("./Formatter");
const fs = require("fs");

const talk = JSON.parse(fs.readFileSync('./data/talk.json', 'utf8'));

module.exports = function talkFnc (mstdn, tootInfo) {
	switch (true) {
		default:
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}からVAWNへのメンションを確認しました。`,
					"コマンドを正しく認識できなかったため処理が行えませんでした。申し訳ありません。",
					"",
					"現在VAWNが対応しているコマンドについては、以下を参照してください。",
					"https://vawn.herokuapp.com/"
				].join("\r\n"),

				visibility: "public",
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/おは/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.goodmorning[Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: "public",
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/おやす/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.goodnight[Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: "public",
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/あり/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.thanks[Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: "public",
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/おめ/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.congrats[Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: "public",
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/誕生日/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.birthday[Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: "public",
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/バカ|ばか|馬鹿|アホ|あほ|ダメ|だめ|違う|バグ/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.bad,
					`#VAWN_improvement`
				].join("\r\n"),

				visibility: "public",
				in_reply_to_id: tootInfo.tootId
			});

			break;
	}
}