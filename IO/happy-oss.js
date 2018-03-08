const Mastodon = reqire("mastodon-api");

let mstdn = new Mastodon({
	api_url: "https://happy-oss.y-zu.org/api/v1/",
	access_token: process.env.YZU
});
