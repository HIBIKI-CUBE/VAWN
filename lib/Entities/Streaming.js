const Status = require("./Status");
const Notification = require("./Notification");

module.exports = class Streaming {
	/**
	 * A collection of streaming's type
	 * 
	 * @static
	 * @readonly
	 */
	static get TYPE () {
		return {
			STATUS: "STREAMING_TYPE_STATUS",
			STATUSID: "STREAMING_TYPE_STATUSID",
			NOTIFICATION: "STREAMING_TYPE_NOTIFICATION"
		}
	}

	/**
	 * Creates an instance of Streaming
	 * @param {{}} streaming An object composing it
	 */
	constructor (streaming) {
		this.__self = streaming;
	}

	/**
	 * Gets this streaming's data
	 * @readonly
	 */
	get data () {
		let self = this.__self;

		if (self.event == "update") return { type: Streaming.TYPE.STATUS, status: new Status(self.data) };
		if (self.event == "delete") return { type: Streaming.TYPE.STATUSID, statusId: self.data };
		if (self.event == "notification") return { type: Streaming.TYPE.NOTIFICATION, notification: new Notification(self.data) };
	}
}