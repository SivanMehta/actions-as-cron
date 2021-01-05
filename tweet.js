const fs = require('fs');
const { promisify } = require('util');
const read = promisify(fs.readFile);
const Markov = require('js-markov');
const fetch = require('node-fetch');

function generateTweets([ topic, tweets ]) {
  const chain = new Markov();
  chain.addStates(tweets);
  chain.train(3);

  return topic + ": " + chain.generateRandom(240 - topic.length - 2);
}

async function tweet(content, token) {
  const status = encodeURI('I\'m back');
  const res = await fetch(`https://api.twitter.com/1.1/statuses/update.json?status=${status}`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  }).then(res => res.json());

  return res;
}

async function getAuthToken({ token, token_secret }) {
  const res = await fetch('https://api.twitter.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8",
      'Authorization': 'Basic ' + token + ':' + token_secret,
    }
  }).then(res => res.json());

  return res;
}

async function run(filename) {
  const content = await read(filename);
  const topics = JSON.parse(content);
  const tweets = topics.map(generateTweets);
  tweets.forEach(t => console.log(t))

  // need to get auth token
  // need to tweet
}

run('content.json');
