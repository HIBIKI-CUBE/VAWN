module.exports = class Janken {
	static ACTIONS = ["✊グー", "✌チョキ", "✋パー"]

	static getState (player = 0, enemy = 0) {
		if (player == enemy) return "あいこ";
		if (player + 1 % 3 == enemy) return "あなたの勝ち";
		
		return "あなたの負け";
	}

	static detectAction (action = "グー") {
		let result = 0;

		switch (action) {
			case "グー":
			case "ぐー":
			case "ぐ～":
				result = 0;
				break;

			case "チョキ":
			case "ちょき":
				result = 1;
				break;

			case "パー":
			case "ぱー":
			case "ぱ～":
				result = 2;
				break;
		}

		return result;
	}
}