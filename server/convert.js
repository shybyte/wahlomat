const fs = require('fs');
const R = require('ramda');
var parse = require('csv-parse/lib/sync');

const fileContent = fs.readFileSync('data/data.csv', 'utf8');
const rows = parse(fileContent);

const header = rows[0];
const body = rows.slice(1);

const ANSWER_MAP = {
  'zustimmung': 'yes',
  'ablehnung': 'no',
  'keine zustimmung': 'no'
};

const toAnswer = (inputAnswer) => ANSWER_MAP[inputAnswer.toLowerCase()] || 'neutral';

const questions = body.map((row, i) => {
  return {
    id: i.toString(),
    text: row[1],
    initiative: row[0],
    initiativeAnswer: toAnswer(row[2]),
    initiativeReason: row[3]
  };
})

const partyStartRow = 4;
const parties = R.splitEvery(2, header.slice(partyStartRow)).map((answerReasonTupel, partyIndex) => {
  const name = answerReasonTupel[0].replace(/\w+\s+/, '');
  return {
    id: name.toLowerCase(),
    name,
    answers: R.fromPairs(body.map((row, i) =>
      [i.toString(), toAnswer(row[partyStartRow + partyIndex * 2])]
    )),
    reasons: R.fromPairs(body.map((row, i) =>
      [i.toString(), row[partyStartRow + partyIndex * 2 + 1]]
    ))
  }
});

console.log(JSON.stringify({ questions, parties }, null, 2));

