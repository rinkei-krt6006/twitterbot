
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



let listgettemp
listget(undefined, "followers")

function listget(num, what) {
	console.log(what + "get")
	key.get(what + '/list',
		{ count: 200, cursor: num },
		function (error, data, log) {

			if (error === null) {
			} else {
				console.log("取得エラー")
				if (error[0].message === 'Rate limit exceeded') {
					console.log("API制限")
				} else {
					console.log(error)
				}
				process.exit()
			}

			if (listgettemp === undefined) {
				listgettemp = data
			} else {
				for (i = 0; i < data.users.length; i++) {
					listgettemp.users.push(data.users[i])
				}
			}
			console.log(data.users[0].name)
			if (data.next_cursor_str != "0") {
				listget(data.next_cursor_str, what)
			} else {
				console.log(what + " " + listgettemp.users.length);
				listgettemp = JSON.stringify(listgettemp, undefined, 4);
				let now = new Date();
				let nowdate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}--${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`
				fs.writeFile("./"+what + "/" + nowdate + ".json", listgettemp);

				/*

				let oldList = fs.readFileSync(`${what}/${what}.json`)
				oldList = JSON.parse(oldList);
				let aryoldList = [];

				let newList = listgettemp;
				newList = JSON.parse(newList);
				let arynewList = [];

				for(let i=0;i<oldList.length;i++){
					aryoldList.push([id,i,oldList[i].name,oldlist[i].screen_name])
				}
				for(let i=0;i<newList.length;i++){
					arynewList.push([id,i,newList[i].name,newlist[i].screen_name])
				}
				console.log(arynewList)

				*/


				if (what === "followers") {
					listgettemp = undefined
					listget(undefined, "friends")
				} else {
					console.log("end");
					process.exit()

				}
			}
		})
};







///////////////////////////////////////




/*
licenses

mitライセンスのnode-twitterを利用させていただきました。

MIT License Copyright (c) 2016 Desmond Morris

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/