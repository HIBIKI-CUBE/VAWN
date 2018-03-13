const Formatter = require("./../Formatter");

module.exports = class Status {
	constructor (status) {
		let self = this.__self = status;

		if (this.isReblog) return new Status(self.reblog);
	}

	get actor () { return this.__self.account.acct }
	get content () { return Formatter.htmlTextToPlainText(this.__self.content) }
	get visibility () { return this.__self.visibility }
	get isReblog () { return this.__self.reblog != null }
	get isMention () { return this.__self.mentions.length > 0 }

	get (field = "") {
		return this.__self[field];
	}
}