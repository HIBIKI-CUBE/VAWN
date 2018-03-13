const Formatter = require("./../Formatter");

module.exports = class Status {
	/**
	 * Creates an instance of Status
	 * @param {{}} status An object composing it
	 */
	constructor (status) {
		let self = this.__self = status;

		if (!(this instanceof ReblogStatus) && this.isReblog) return new ReblogStatus(self.reblog);
	}

	get actor () { return this.__self.account.acct }
	get content () { return Formatter.htmlTextToPlainText(this.__self.content) }
	get visibility () { return this.__self.visibility }
	get mentions () { return this.__self.mentions }

	get isReblog () { return this.__self.reblog != null }
	get isMention () { return this.__self.mentions.length > 0 }

	/**
	 * Gets a value of selected field
	 * 
	 * @param {string} [field=""] A key of field
	 * @returns {any}
	 */
	get (field = "") {
		return this.__self[field];
	}
}

const ReblogStatus = require("./ReblogStatus");