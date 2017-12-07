#!/home/ubuntu/.nodebrew/current/bin/node
const fs = require("fs");
const util = require("util");
const twitter = require("twitter");
let path = require("path");
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout
});

let pathdata = process.argv[1];
pathdata = path.dirname(pathdata);
let key = fs.readFileSync(__dirname + "/key.txt", "utf8");
if (key === "") {
	console.log("https://apps.twitter.com/ からapi-keyを取得し,keyset.jsを使用してキーを登録してください。");
	process.exit();
} else {
	key = key.split(",");
	key = new twitter({
		consumer_key: key[0],
		consumer_secret: key[1],
		access_token_key: key[2],
		access_token_secret: key[3]
	});
};

//文字色
const black = '\u001b[30m';
const red = '\u001b[31m';
const green = '\u001b[32m';
const yellow = '\u001b[33m';
const blue = '\u001b[34m';
const magenta = '\u001b[35m';
const cyan = '\u001b[36m';
const white = '\u001b[37m';
const reset = '\u001b[0m';
//記憶域
let twinum = -1;
let twiid = [];
let twitxt = [];
let twiname = [];
let scname = [];
let replynum = "";
let mode = undefined;

console.log("welcome")

key.stream('user', function (stream) {

	stream.on("data", function (data) {

		let tmp = data.source;
		tmp = tmp.split('">');
		tmp = tmp[1].split('</a>');

		twinum = twinum + 1;
		twiid.push(data.id_str);
		twitxt.push(data.text);
		twiname.push(data.user.name);
		scname.push(data.user.screen_name);

		let temp = "No." + twinum + "\r\n";
		temp += cyan + data.user.name + " @" + data.user.screen_name + "\r\n";
		temp += white + data.text + "\r\n";
		temp += green + "via " + tmp + "\r\n";
		temp += data.user.created_at + reset + "\r\n";
		console.log(twinum)
		if(1000<twiid.length){
			twinum = -1;
			twiid.length = 0;
			twitxt.length = 0;
			twiname.length = 0;
			scname.length = 0;
			now = new Date
			console.log("reset"+now.toLocaleDateString+now.toLocaleTimeString)
		}
	});


	stream.on("delete", function (data) {
		let text = "ピピーっ！👮👮ツイッター警察です🚨🚨🙅🙅あなたはツイッター迷惑行為防止条例第334条🌟「ツイ消しをしてはいけない❗️😡👊🏻」に違反しているゾ😤😤😤💢💢💢！！！！！ぃますぐ😩😩😩ツイートをし直しなさい💢💢💢！！！😇";
		for (let i = twiid.length; i > 0; i--) {
			if (twiid[i] === data.delete.status.id_str) {
				if(twitxt[i].match(/RT @/)){
					//rt取り消し
				}else{
				key.post('statuses/update',
					{ status: "@" + scname[i] +" "+ text, in_reply_to_status_id: data.delete.status.id_str },
					function (error, tweet, response) {
					})
					console.log("ツイ消し警察")
					console.log(new Date)
					break;
				}
			}
		}
	})

	stream.on('follow', function(data) {
		console.log("follow");
		console.log(new Date)		
    key.post('friendships/create', {user_id:data.source.id_str});
  });
});

	/*
	key.get("users/show.json",
		{ user_id: data.delete.status.user_id_str },
		function (err, userdata) {
			key.post('statuses/update',
				{ status: "@" + userdata.screen_name + text, in_reply_to_status_id: data.delete.status.id_str },
				function (error, tweet, response) {
					if (!error) {
					} else {
						console.log(error)
					}
				})
		}
	)
*/



/*
licenses

mitライセンスのnode-twitterを利用させていただきました。

MIT License Copyright (c) 2016 Desmond Morris

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
