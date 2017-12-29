const htmlToText = require("html-to-text");

module.exports = class Formatter {
	static getInfoFromToot (toot) {
		return {
			tooter: toot.data.account.acct,
			tootId: toot.data.id,
			tootContent: htmlToText.fromString(toot.data.content)
		}
	}

	static htmlTextToPlainText (htmlText = "") {
		return htmlText.replace(/ \[(https?|ftp)(:\/\/[-_.!~*¥'()a-zA-Z0-9;¥/?:¥@&=+¥$,%#]+)\]/g, "");
	}
}