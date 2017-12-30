#!/home/ubuntu/.nodebrew/current/bin/node
const fs = require("fs");
const twitter = require("twitter");
const Sequelize = require('sequelize').Sequelize;
const cron = require('cron').CronJob;

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

const dbObjBySequelize = new Sequelize(
	process.env.database,
	process.env.user,
	process.env.password,
	{
		dialect: 'mysql',
		port: process.env.localPort,
		host: process.env.localHost
	}
);
const DBtimeline = dbObjBySequelize.define(
	'timeline',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		id_str: {
			type: Sequelize.STRING
		},
		text: {
			type: Sequelize.STRING
		},
		user_id: {
			type: Sequelize.STRING
		},
		user_name: {
			type: Sequelize.STRING
		},
		user_screen_name: {
			type: Sequelize.STRING
		},
		time: {
			type: Sequelize.STRING
		},
		delete: {
			type: Sequelize.STRING
		},
	},
	{
		freezeTableName: true,
		timestamps: false
	}
);
const DBkichitsui = dbObjBySequelize.define(
	'kichitsui',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		text: {
			type: Sequelize.STRING
		},
	},
	{
		freezeTableName: true,
		timestamps: false
	}
);

key.get("account/verify_credentials", function (error, data) {
	mydata = JSON.stringify(data)
	mydata = JSON.parse(mydata)
	//console.log(mydata)

	console.log("認証アカウント")
	console.log("@" + mydata.screen_name)
	console.log(mydata.name)
	console.log("\n")

})
key.stream('user', function (stream) {
	stream.on("direct_message", function (data) {
		console.log(data)
	})
	stream.on("data", function (data) {
		if (!!data.direct_message) {
			//DM
			if (data.direct_message.sender.id_str === mydata.id_str) {
				//自分が送信したDM
			} else {
				if (data.direct_message.sender.id_str === "732074970419863553") {
					//KRT6006からのDM
					let newDBkichitsui = new DBkichitsui({
						text: data.direct_message.text,
					})
					newDBkichitsui.save()
				} else {
					//他人からのDM
				}
			}
		} else {
			//ツイート
			let time = new Date(data.created_at)
			let localTime = time.toLocaleString()
			console.log(localTime)
			let newDBtimeline = new DBtimeline({
				id_str: data.id_str,
				text: data.text,
				user_id: data.user.id_str,
				user_name: data.user.name,
				user_screen_name: data.user.screen_name,
				time: localTime,
			})
			newDBtimeline.save()
		}
		stream.on('error', function (error) {
			console.log(error);
			resflg = 1;
		});
	});


	stream.on("delete", function (data) {
		let text = "ピピーっ！👮👮ツイッター警察です🚨🚨🙅🙅あなたはツイッター迷惑行為防止条例第334条🌟「ツイ消しをしてはいけない❗️😡👊🏻」に違反しているゾ😤😤😤💢💢💢！！！！！ぃますぐ😩😩😩ツイートをし直しなさい💢💢💢！！！😇";
		DBtimeline.findAll({
			where: {
				id_str: data.delete.status.id_str
			}
		}).then(deleteTweet => {
			if (deleteTweet[0].text.match(/RT @/)) {
				//rt取り消し
			} else {
				key.post('statuses/update',
					{ status: "@" + deleteTweet[0].user_screen_name + " " + text, in_reply_to_status_id: data.delete.status.id_str },
					function (error, tweet, response) {
					})
				key.post('direct_messages/new',
					{ user_id: deleteTweet[0].user_id, text: deleteTweet[0].text + "\n" + deleteTweet[0].time + "\nが削除されたことを検知しました。" },
					function (err, data, resp) {

					})
				console.log("ツイ消し警察");
				console.log(new Date);
				DBtimeline.update({
					delete: "true"
				},
					{ where: { id_str: data.delete.status.id_str +""} }

				)
				return;
			}
		})
	})

	stream.on('follow', function (data) {
		console.log("follow");
		console.log(new Date)
		key.post('friendships/create', { user_id: data.source.id_str });
	});
});

var job = new cron({
	cronTime: '0 0,30 * * * *',
	//cronTime: '*/2 * * * * *',
	onTick: function () {
		let postData
		DBkichitsui.findAll({
		}).then(DBdata => {
			postData = DBdata[Math.floor(Math.random() * DBdata.length)].text

			key.post('statuses/update',
				{ status: postData },
				function (error, tweet, response) {
				})
		})

	},
	start: false, //newした後即時実行するかどうか
	timeZone: 'Asia/Tokyo'
});
job.start();


/*
licenses

mitライセンスのnode-twitterを利用させていただきました。

MIT License Copyright (c) 2016 Desmond Morris

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
