const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');

const URL = "mongodb://localhost:27017/lorawan_data";

const data = require('./feed.json');

function convertToRecordsFromFile(filePath) {

  const fileData = fs.readFileSync(filePath);

  let records = fileData.toString().replace(/\r/g, '').split('\n');

  let fields = records.splice(0, 1)[0].split(',');

  records = records.map((recordString) => {

    const recordDataArray = recordString.split(',');

    if (recordDataArray.length < 8) {
      return;
    }

    let record = {};

    for (let recordDataIndex = 0; recordDataIndex < recordDataArray.length; recordDataIndex++) {

      record[fields[recordDataIndex]] = recordDataArray[recordDataIndex];

    }

    return record;

  }).filter((record) => typeof record !== 'undefined');

  return records;

}

const filePath = './feeds.csv';

const feeds = convertToRecordsFromFile(filePath);

const refactoredData = {};

refactoredData[data.channel.id] = {};

refactoredData[data.channel.id].basicFields = {
  ...data.channel
};

function getDateFromDateString(dateTimeString) {

  const date = dateTimeString.split(' ')[0];

  return date;

}

function getTimeFromDateString(dateTimeString) {

  const time = dateTimeString.split(' ')[1];

  return time;

}

for (let feed of feeds) {

  if (typeof refactoredData[data.channel.id][getDateFromDateString(feed.created_at)] === 'undefined') {
    refactoredData[data.channel.id][getDateFromDateString(feed.created_at)] = [];
  }

  refactoredData[data.channel.id][getDateFromDateString(feed.created_at)].push({
    ...feed,
    time: getTimeFromDateString(feed.created_at)
  });

}

async function tryCreateCollection(collectionName) {

  MongoClient.connect(URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db("lorawan_data");
    dbo.createCollection(collectionName, function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
    });
    db.close();
  });

}

async function getAllDocumentsFromCollection(collectionName) {

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

async function insertDocumentToCollection(collectionName) {

  MongoClient.connect(URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db("lorawan_data");
    dbo.collection(collectionName).insertOne(refactoredData, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
    });
    db.close();
  });

}

function updateDocumentInCollection(collectionName, documentId) {

  MongoClient.connect(URL, function (err, db) {
    if (err) throw err;
    var dbo = db.db("lorawan_data");
    var query = { _id: mongodb.ObjectID(documentId) };
    dbo.collection(collectionName).deleteOne(query, function (err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
    });
    db.close();
  });

  insertDocumentToCollection(collectionName);

}

async function findAndUpdateDataInDatabase() {

  const collectionName = '' + data.channel.id;

  tryCreateCollection(collectionName);

  const documents = await getAllDocumentsFromCollection(collectionName);

  if (documents.length === 0) {
    insertDocumentToCollection(collectionName);
  } else {
    const documentId = documents[0]._id;
    updateDocumentInCollection(collectionName, documentId);
  }

}

findAndUpdateDataInDatabase();