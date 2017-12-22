const http = require("http");
const https = require("https");
const express = require("express");



let app = express();
  app.use(express.static('views'));
  
  app.get("/", function (request, response) {
    response.sendFile(__dirname + '/views/');
  });
  
  app.get("/user/:id", (req, res) => {
    let getter = https.get(`https://www.googleapis.com/plus/v1/people/${req.params.id}`, (req) => {
      let data = null;
      
      res.on("data", buffer => data += buffer);
      res.on("end", () => res.json(JSON.parse(data)).end());
    });
  });
  
let listener = app.listen(process.env.PORT, function () {
  console.log(`[VAWN] I'm running on port ${listener.address().port}!!`);
});