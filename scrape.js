const fs = require('fs');
const { promisify } = require('util');
const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);
const fetch = require('node-fetch');

/**
 * Get trending topics in the US
 *
 * @param {String} token bearer token
 * @returns {Object}
 */
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

/**
 * Get popular tweets for a given trend
 *
 * @param {*} trend trending topic
 * @param {*} token bearer token
 */
async function getContent(trend, token) {
  const data = await fetch(`https://api.twitter.com/1.1/search/tweets.json?q=${trend.query}&result_type=popular&count=100`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(res => res.json());

  const content = data
    .statuses
    .map(t => t.text.split('https://')[0])
    .map(t => t.replace('…', ''));

  return [trend.name, content];
}

async function getSecrets() {
  const secretFile = 'secrets.json';
  if (fs.existsSync(secretFile)) {
    const content = await read('secrets.json');
    return JSON.parse(content);
  } else {
    return {
      bearer: process.env.BEARER
    };
  }
}

async function run(filename) {
  const secrets = await getSecrets();
  const token = secrets.bearer;

  const topics = await getTopics(token);
  const contentJobs = topics.map(trend => getContent(trend, token));
  const content = await Promise.all(contentJobs);

  await write(filename, JSON.stringify(content, null, 2));
};

run('content.json');
