const Formatter = require("./Formatter");
const fs = require("fs");

const talk = JSON.parse(fs.readFileSync('./data/talk.json', 'utf8'));
const currentTime = new Date();
let hou = currentTime.getHours();
let min = currentTime.getMinutes();

module.exports = function talkFnc (mstdn,tootInfo,hou,min,tootVis) {
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

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/おは/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.goodmorning[Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/おやす/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.goodnight[Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/あり/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.thanks[Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/おめ/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.congrats[Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/誕生日/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.birthday[Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/(暇|ひま)/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.free[Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/りさ姉|リサ姉|Siri|Cortana|コルタナ|Assistant|アシスタント|Alexa|アレクサ/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk. senior[Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(Formatter.htmlTextToPlainText(tootInfo.tootContent).match(/いま|今|現在|げんざい|時間|じかん|時刻|じこく/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					`現在の時刻は${hou}時${min}分です。`
				].join("\r\n"),

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(tootInfo.tootContent.match(/コイン/)):
			if(Math.floor(Math.random())){
				let coin = "おもて"
			}else{
				let coin = "うら"
			};
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					`${coin}が出ました。`
				].join("\r\n"),

				visibility: tootVis,
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

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;
	}
}