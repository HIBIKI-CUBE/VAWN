const Formatter = require("./Formatter");
const fs = require("fs");

const talk = JSON.parse(fs.readFileSync('./data/talk.json', 'utf8'));

module.exports = class talkFnc {
	static talk (tootInfo) {
		
		for (let i = 0; i < talk.notice.length; i++) {
			if (tootInfo.tootContent.match(new RegExp(talk.notice[i]))) {
				return talk.response[i][Math.floor(Math.random() * talk.response[i].length)]
			}
		}
	}
}