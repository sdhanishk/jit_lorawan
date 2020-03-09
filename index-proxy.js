// const https = require('https');

// https.get('https://api.thingspeak.com/channels/1008416/feed.json?results=8000', (resp) => {
//   let data = '';

//   resp.on('data', (chunk) => {
//     data += chunk;
//   });

//   resp.on('end', () => {
//     console.log(JSON.parse(data).channel);
//   });

// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// });

// const request = require('request');

// request('https://api.thingspeak.com/channels/1008416/feed.json?results=8000', { json: true }, (err, res, body) => {
//   if (err) { return console.log(err); }
//   console.log(body.url);
//   console.log(body);
// });

// const axios = require('axios');

// axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
//   .then(response => {
//     console.log(response.data.url);
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.log(error);
//   });

// var MongoClient = require('mongodb').MongoClient;

// const data = require('./feed-1.json');

// data.createdAt = Date.now();

// const url = "mongodb://localhost:27017/lorawan_data";

// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     console.log("Database created!");
//     db.close();
// });

// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("lorawan_data");
//     dbo.createCollection("data", function (err, res) {
//         if (err) throw err;
//         console.log("Collection created!");
//     });
//     dbo.collection("data").insertOne(data, function (err, res) {
//         if (err) throw err;
//         console.log(res.ops);
//         console.log("1 document inserted");
//     });
// });

// console.log(data.feeds[26]);

// var MongoClient = require('mongodb').MongoClient;

// const url = "mongodb://localhost:27017/lorawan_data";

// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     console.log("Database created!");
//     var dbo = db.db("lorawan_data");
//     dbo.createCollection("lora", function (err, res) {
//         if (err) throw err;
//         console.log("Collection created!");
//     });
//     dbo.collection("lora").insertOne(data, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//     });
//     db.close();
// });

// const refactoredData = {};

// refactoredData[data.channel.id] = {};

// const feeds = [...data.feeds];

// refactoredData[data.channel.id].basicFields = {
//     ...data.channel
// };

// function getDateFromDateString(dateTimeString) {

//     const date = dateTimeString.split('T')[0];

//     return date;

// }

// function getTimeFromDateString(dateTimeString) {

//     const time = dateTimeString.split('T')[1].replace('Z', '');

//     return time;

// }

// for (let feed of feeds) {

//     refactoredData[data.channel.id][getDateFromDateString(feed.created_at)] = {
//         ...feed,
//         time: getTimeFromDateString(feed.created_at)
//     };

// }

// console.log(refactoredData);