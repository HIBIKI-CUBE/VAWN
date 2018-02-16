const htmlToText = require("html-to-text");

module.exports = class Formatter {
	static getInfoFromToot (toot) {
		return {
			tooter: toot.data.status.account.acct,
			tootId: toot.data.status.id,
			tootContent: Formatter.htmlTextToPlainText(htmlToText.fromString(toot.data.status.content))
		}
	}

	static htmlTextToPlainText (htmlText = "") {
		return htmlText.replace(/ \[(https?|ftp)(:\/\/[-_.!~*¥'()a-zA-Z0-9;¥/?:¥@&=+¥$,%#]+)\]/g, "");
	}
	static mentionRemove (htmlText = "") {
		return htmlText.replace("@vawn [https://happy-oss.y-zu.org/@vawn] ", "");
	}
	static googleRemove (htmlText = "") {
		return htmlText.replace("ウィキペディア", "").replace("免責事項", "").replace("さらに表示", "");
	}
}