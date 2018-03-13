const fs = require("fs");
const express = require("express");
const Mastodon = require("mastodon-api");
const scrape = require('cheerio-httpcli');
const webshot = require('webshot');
const firebase = require("firebase-admin");

const Formatter = require("./funcs/Formatter");

const package = JSON.parse(fs.readFileSync("./package.json", "UTF-8"));

let mstdn = new Mastodon({
	api_url: "https://happy-oss.y-zu.org/api/v1/",
	access_token: process.env.TOKEN_YZU_OSS
});

let stream = mstdn.stream("streaming/user");
	stream.on("message", toot => {
		if (toot.event == "notification" && toot.data.type == "mention") {
			let tootInfo = Formatter.getInfoFromToot(toot);

			console.log(`${tootInfo.tooter} … ${tootInfo.tootContent}, ${tootInfo.tootVisibility}`);
		}
	});

let app = express();
	app.use("/", express.static(`${__dirname}/docs/`));
	
let listener = app.listen(process.env.PORT, function () {
	console.log(`[${package.name} ${package.version}] I'm running on port ${listener.address().port}!!`);
	
	mstdn.post("statuses", {
		status: [
			`VAWN Next is ready.`,
			`Version: ${packageInfo.version}`
		].join("\r\n"),

		visibility: "unlisted"
	});
});