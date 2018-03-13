const fs = require("fs");
const express = require("express");
const Mastodon = require("mastodon-api");
const scrape = require('cheerio-httpcli');
const webshot = require('webshot');
const firebase = require("firebase-admin");

const Status = require("./lib/Entities/Status");
const Notification = require("./lib/Entities/Notification");
const Streaming = require("./lib/Entities/Streaming");
const Formatter = require("./lib/Formatter");

const package = JSON.parse(fs.readFileSync("./package.json", "UTF-8"));

let mstdn = new Mastodon({
	api_url: `${process.env.INSTANCE_YZU_OSS}/api/v1/`,
	access_token: process.env.TOKEN_YZU_OSS
});

let stream = mstdn.stream("streaming/user");
	stream.on("message", res => {
		let streaming = new Streaming(res),
			status = streaming.data.status;

		console.log(status);

		if (status && status.isMention) {
			console.log([
				`<${status.actor}>`,
				status.content,
				`(Visibility: ${status.visibility})`
			].join("\r\n"));

			if (status.content.match(/\$debug eval (.*)/)) {
				eval(console.log(status.content.match(/\$debug eval (.*)/)[1]));
			}
		}
	});

let app = express();
	app.use("/", express.static(`${__dirname}/docs/`));
	
let listener = app.listen(process.env.PORT, function () {
	console.log(`[${package.name} ${package.version}] I'm running on port ${listener.address().port}!!`);
	
	mstdn.post("statuses", {
		status: [
			`VAWN Next is ready.`,
			`Version: ${package.version}`
		].join("\r\n"),

		visibility: "unlisted"
	});
});