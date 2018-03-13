const Status = require("./Status");

module.exports = class ReblogStatus extends Status {
	/**
	 * Creates an instance of ReblogStatus, which is type of Status
	 * @param {{}} status An object composing it
	 */
	constructor (status) {
		super(status);
	}
	
	get isReblog () { return true }
}