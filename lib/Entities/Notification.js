const Status = require("./Status");

module.exports = class Notification {
	/**
	 * A collection of notificaion's type
	 * 
	 * @static
	 * @readonly
	 */
	static get TYPE () {
		return {
			FAV: "favourite",
			REBLOG: "reblog",
			MENTION: "mention",
			FOLLOW: "follow"
		}
	}

	/**
	 * Creates an instance of Notification
	 * @param {{}} notification An object composing it
	 */
	constructor (notification) {
		let self = this.__self = notification;

		if (this.isFavourite) {
			this.faved = new Status(self.status);
			this.faver = self.account;
		}

		if (this.isReblog) {
			this.reblogged = new Status(self.status),
			this.reblogger = self.account;
		}

		if (this.isMention) this.status = new Status(self.status);
	}
	
	get isFavourite () { return this.__self.type == Notification.TYPE.FAV }
	get isReblog () { return this.__self.type == Notification.TYPE.REBLOG }
	get isMention () { return this.__self.type == Notification.TYPE.MENTION }
	get isFollow () { return this.__self.type == Notification.TYPE.FOLLOW }
}