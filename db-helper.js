const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');

const data = require('./feed.json');

const URL = "mongodb://localhost:27017/lorawan_data";
const collectionName = '' + data.channel.id;

async function getAllDocumentsFromCollection() {

    return new Promise(function (resolve, reject) {
      MongoClient.connect(URL, function (err, db) {
        if (err) {
          reject(err);
        } else {
          resolve(db);
        }
      })
    }).then(function (db) {
      return new Promise(function (resolve, reject) {
        var dbo = db.db("lorawan_data");
        var collection = dbo.collection(collectionName);
  
        collection.find().toArray(function (err, items) {
          if (err) {
            reject(err);
          } else {
            resolve(items);
          }
        });
  
        db.close();
      });
    });
  
  
  }

  module.exports = {
    getAllDocumentsFromCollection
  };