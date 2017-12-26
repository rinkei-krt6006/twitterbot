#!/home/ubuntu/.nodebrew/current/bin/node
const fs = require("fs");
const util = require("util");
const twitter = require("twitter");
let path = require("path");
let cron = require('cron').CronJob
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout 
});

let pathdata = process.argv[1];
pathdata = path.dirname(pathdata);

require('dotenv').config();
if (process.env.consumer_key === undefined) {
	console.log("https://apps.twitter.com/ からapi-keyを取得し,.env_sampleを使用してキーを登録してください。");
	process.exit();
} else {
	key = new twitter({
		consumer_key: process.env.consumer_key,
		consumer_secret: process.env.consumer_secret,
		access_token_key: process.env.access_token_key,
		access_token_secret: process.env.access_token_secret
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
let twiscname = [];
let replynum = "";
let mode = undefined;

function posttweet (twi){
		key.post('statuses/update',
			{ status: twi },
			function (error) {
				if (!!error) {
					console.log(red + "error" + reset);
					console.log(error);
					console.log(new Date);
				};
				//process.exit();
			});
		}
		
		// cronJobの引数は、秒・分・時間・日・月・曜日の順番
    new cron('0 0 * * * *', function () {
			let now = new Date
			
			posttweet()
	}).start();


		//switch shell

/*
licenses

mitライセンスのnode-twitterを利用させていただきました。

MIT License Copyright (c) 2016 Desmond Morris

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/