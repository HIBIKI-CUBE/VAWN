const fs = require("fs");
const htmlToText = require("html-to-text");
const talk = JSON.parse(fs.readFileSync("./data/talk.json", "UTF-8"));

module.exports = class Formatter {
	static get Suumo () {
		return class Suumo {
			static get defaultPhrase () { return talk.suumo }

			static generate (phrase = "") {
				let phraseParts = phrase.match(/^(.{1,3})[ー～]+(.{1,3})$/);

				let phrase1 =
						phraseParts ?
							phraseParts[1] + phraseParts[2] :
						phrase.substr(0, 2),

					phrase2 =
						phrase.length > 3 ?
							`${phrase.substr(0, 2)}～～～${phrase.substr(phrase.length - 2, 2)}` :
						phrase.length == 3 ?
							`${phrase.substr(0, 1)}～${phrase.substr(1, 1)}～${phrase.substr(2, 1)}` :
						phrase.length == 2 ?
							`${phrase.substr(0, 1)}～～～${phrase.substr(1, 1)}` :
						`${phrase}～～～`;

				let generated = this.defaultPhrase;
					generated.replace(/\${phrase}/g, phrase).replace(/\${phrase_1}/g, phrase1).replace(/\${phrase_2}/g, phrase2);

				return generated;
			}
		}
	}

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

	static splitByLength (text = "", length = 500) {
		return text.match(new RegExp(`.{1,${length}}`, "g"));
	}
}