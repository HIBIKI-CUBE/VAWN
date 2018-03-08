const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE);
fb.initializeApp({
	credential: fb.credential.cert(serviceAccount),
	databaseURL: "https://vawn-yzu.firebaseio.com"
})
const db = admin.database();
const info = db.ref("data/info");
module.exports = class Firebase{
	constructor(){
		
	}
	
	static recieve (ID,request,service,account) {
		info.push().set({
			[ID]:{
				"request":request,
				"service":service,
				"account":account
			}
		});
	}
	
	static type (ID,value) {
		info.push().set({
			[ID]:{
				"type":value
			}
		});
	}
	
	static response (ID,value) {
		info.push().set({
			[ID]:{
				"response":value
			}
		});
	}
}