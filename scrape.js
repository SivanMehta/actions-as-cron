const fs = require('fs');
const { promisify } = require('util');
const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);
const fetch = require('node-fetch');

async function getTopics(token) {
  const data = await fetch('https://api.twitter.com/1.1/trends/place.json?id=23424977', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(res => res.json());

  return data[0]
    .trends
    .filter(t => t.tweet_volume)
    .sort((a, b) => a.tweet_volume > b.tweet_volume);
}

async function run(filename) {
  const secrets = await read('secrets.json');
  const token = JSON.parse(secrets).bearer;
  const topics = await getTopics(token);

  const content = topics;

  await write(filename, JSON.stringify(content, null, 2));
};

run('content.json');
