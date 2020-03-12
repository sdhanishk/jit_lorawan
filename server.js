const databaseMethods = require('./db-helper');

const results = databaseMethods.getAllDocumentsFromCollection();

results.then((results) => {
    console.log(getFeedsByDate('1008416', results[0], '2020-03-08'));

    let keys = Object.keys(results[0]['1008416']);
    keys.splice(0,1);
    console.log(keys);
});

function getFeedsByDate(channelId, data, date) {

    return data[channelId][date];

}