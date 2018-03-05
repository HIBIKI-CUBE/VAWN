const Formatter = require("./Formatter");
const fs = require("fs");

const talk = JSON.parse(fs.readFileSync('./data/talk.json', 'utf8'));

module.exports = function talkFnc (mstdn, tootInfo, tootVis) {

for(let i=0;i<talk.noti.length;i++){
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
			
		case !!(tootInfo.tootContent.match(talk.noti[i])):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					talk.res[i][Math.floor(Math.random() * 2)]
				].join("\r\n"),

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(tootInfo.tootContent.match(/いま|今|現在|げんざい|時間|じかん|時刻|じこく/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					`その仕事はまだできません！`,
					`対応まで、もうしばらくお待ちください。`
				].join("\r\n"),

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;

		case !!(tootInfo.tootContent.match(/コイン/)):
			let coin = "";
			if(Math.round(Math.random())){
				coin = "おもて";
			}else{
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
			break

		case !!(tootInfo.tootContent.match(/バカ|ばか|馬鹿|アホ|あほ|ダメ|だめ|違う|バグ/)):
			mstdn.post("statuses", {
				status: [
					`@${tootInfo.tooter}`,
					"申し訳ありません。もっとお役に立てるよう改善に努めます。",
					`#VAWN_improvement`
				].join("\r\n"),

				visibility: tootVis,
				in_reply_to_id: tootInfo.tootId
			});

			break;
	}
}
}