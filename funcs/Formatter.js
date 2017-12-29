import htmlToText from "html-to-text";

export default class Formatter {
	static getInfoFromToot (toot) {
		return {
			tooter: toot.data.account.acct,
			tootId: toot.data.id,
			tootContent: htmlToText.fromString(toot.data.content)
		}
	}
}