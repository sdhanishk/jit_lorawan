const moment = require('moment');

const databaseMethods = require('./db-helper');

const results = databaseMethods.getAllDocumentsFromCollection();

results.then((results) => {
    // console.log(getFeedsByDate('1008416', results[0], '2020-03-08'));
    // console.log(getFeedsBetweenTwoDates('1008416', results[0], '2020-03-06', '2020-03-08'));
    console.log(getFeedsByMonth('1008416', results[0], '2020-03'));
});

function getFeedsByDate(channelId, data, date) {

    return data[channelId][date];

}

function getFeedsBetweenTwoDates(channelId, data, date1, date2) {

    const date1Timestamp = moment(date1,'YYYY-MM-DD').toDate().getTime();
    const date2Timestamp = moment(date2,'YYYY-MM-DD').toDate().getTime();

    let keys = Object.keys(data[channelId]);
    keys.splice(0,1);

    const returnableFeeds = [];

    for (let date of keys) {

        let dateTimestamp = moment(date, 'YYYY-MM-DD').toDate().getTime();

        if (dateTimestamp >= date1Timestamp && dateTimestamp <= date2Timestamp) {
            returnableFeeds.push(...data[channelId][date]);
        }

    }

    return returnableFeeds;

}

function getFeedsByMonth(channelId, data, month) {

    const monthTimestamp = moment(month, 'YYYY-MM');

    let keys = Object.keys(data[channelId]);
    keys.splice(0,1);

    const returnableFeeds = [];

    for (let date of keys) {

        let dateTimestamp = moment(date, 'YYYY-MM-DD');

        if (dateTimestamp.isSame(monthTimestamp, 'month')) {
            returnableFeeds.push(...data[channelId][date]);
        }

    }

    return returnableFeeds;

}