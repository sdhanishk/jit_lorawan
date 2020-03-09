const fs = require('fs');

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

    refactoredData[data.channel.id][getDateFromDateString(feed.created_at)] = {
        ...feed,
        time: getTimeFromDateString(feed.created_at)
    };

}

console.log(refactoredData);