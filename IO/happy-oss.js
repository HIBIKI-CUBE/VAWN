const Mastodon = reqire("mastodon-api");

let mstdn = new Mastodon({
	api_url: "https://happy-oss.y-zu.org/api/v1/",
	access_token: process.env.YZU
});

module.exports = class IO {
	static receve (){
		let stream = mstdn.stream("streaming/user");
		stream.on("message", toot => {
			if (toot.event == "notification" && toot.data.type == "mention") {
				let tootInfo = Formatter.getInfoFromToot(toot);
				let tootVis = tootInfo.tootVisibility;
				let qna = new Object();

				console.log(`${tootInfo.tooter} … ${tootInfo.tootContent}, ${tootVis}`);

				if (tootInfo.tootContent.toUpperCase().match(/@VAWN/g)) {
					return tootInfo;
				}else{ return undefined; }
			}
		});
	}
		
	static reply (content = [],tooter,vis = "public",rep = undefined){
		mstdn.post("statuses", {
			status: [
				`@${tooter}`
			].push(...content).join("\r\n"),

			visibility: vis,
			in_reply_to_id: rep
		});
		return true;
	}
	
	static post (content = [],vis = "public",rep = undefined){
		mstdn.post("statuses", {
			status: content.join("\r\n"),

			visibility: vis,
			in_reply_to_id: rep
		});
		return true;
	}
}