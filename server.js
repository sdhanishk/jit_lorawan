const moment = require('moment');

const databaseMethods = require('./db-helper');

const results = databaseMethods.getAllDocumentsFromCollection();

results.then((results) => {
    console.log(getFeedsByDate('1008416', results[0], '2020-03-08'));
    console.log(getFeedsBetweenTwoDates('1008416', results[0], '2020-03-06', '2020-03-08'));
    console.log(getFeedsByMonth('1008416', results[0], '2020-03'));
    console.log(getFeedsBetweenHours('1008416', results[0], '2020-03-04-11', '2020-03-04-11'));
});

function getFeedsByDate(channelId, data, date) {

    return data[channelId][date];

}

function getFeedsBetweenTwoDates(channelId, data, date1, date2) {

    const date1Timestamp = moment(date1, 'YYYY-MM-DD').toDate().getTime();
    const date2Timestamp = moment(date2, 'YYYY-MM-DD').toDate().getTime();

    let keys = Object.keys(data[channelId]);
    keys.splice(0, 1);

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
    keys.splice(0, 1);

    const returnableFeeds = [];

    for (let date of keys) {

        let dateTimestamp = moment(date, 'YYYY-MM-DD');

        if (dateTimestamp.isSame(monthTimestamp, 'month')) {
            returnableFeeds.push(...data[channelId][date]);
        }

    }

    return returnableFeeds;

}

function getFeedsBetweenHours(channelId, data, timeString1, timeString2) {

    const dateParts = timeString1.split('-');

    const date = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;

    const timestamp1 = moment(timeString1, 'YYYY-MM-DD-hh');
    const timestamp2 = moment(timeString2, 'YYYY-MM-DD-hh');

    let keys = Object.keys(data[channelId]);
    keys.splice(0, 1);

    const returnableFeeds = [];

    for (let feed of data[channelId][date]) {

        const feedCreatedAtTimeStamp = moment(feed.createdAt);

        const isTimeAfter = feedCreatedAtTimeStamp.isAfter(timestamp1, 'hour');
        const isTimeBefore = feedCreatedAtTimeStamp.isBefore(timestamp2, 'hour');
        const isTimeSame = feedCreatedAtTimeStamp.isSame(timestamp1, 'hour') || feedCreatedAtTimeStamp.isSame(timestamp2, 'hour');

        if ((isTimeAfter && isTimeBefore) || isTimeSame) {
            returnableFeeds.push(feed);
        }

    }

    return returnableFeeds;

}