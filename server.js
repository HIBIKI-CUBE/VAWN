const express = require("express");
const htmlToText = require("html-to-text");
const Mastodon = require("mastodon-api");
const settings = require("./settings.js");


//Set Mastodon API for Yづドン
let mstdn = new Mastodon({
  api_url: "https://mstdn.y-zu.org/api/v1/",
  access_token: "d10236623369775c3027b28237dfb1bb1447c9f456c7f1f7a8e5af0017bda3bf" //This is for only developing.
});

let stream = mstdn.stream("streaming/user");
  stream.on("message", msg => {
    let from = msg.data.account.acct;
    let msgId = msg.data.id;
    let content = htmlToText.fromString(msg.data.content);
    
    //console.log(msg.data);
    console.log(`${from} … ${content}`);
    
    if (content.toUpperCase().match(/@VAWN/g)) {
      let result = "";
      
      if (result = content.match(/(@.+) に(\d+)YZUを(与える|あげる|渡す|わたす)/)) {
        console.log(result);
        //mstdn.post("statuses", { status: `@${from} が` });
      } else if (result = content.match(/(あなた|きみ|君|おまえ|お前|VAWN|vawn)の(親|父親)は/)) {
        console.log(result);
        mstdn.post("statuses", { status: `@${from} 私を作ってくれたのはYづどんのみなさんです！`, visibility: "unlisted", in_reply_to_id: msgId });
      } else {
        mstdn.post("statuses", { status: `@${from}からVAWNへのコマンドを確認しました`, visibility: "unlisted", in_reply_to_id: msgId });
      }
    }
  });
  
let app = express();
  app.use(express.static('views'));
  
  app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/');
  });
  
let listener = app.listen(process.env.PORT, function () {
  console.log(`[VAWN] I'm running on port ${listener.address().port}!!`);
});