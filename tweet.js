const fs = require('fs');
const { promisify } = require('util');
const read = promisify(fs.readFile);
const Markov = require('js-markov');
const fetch = require('node-fetch');

function generateTweets([ topic, tweets ]) {
  const chain = new Markov();
  chain.addStates(tweets);
  chain.train(3);

  return chain.generateRandom(240);
}

async function tweet(content, token) {
  const res = await fetch('https://api.twitter.com/1.1/statuses/update.json?status=hello', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(res => res.json());

  return res;
}

async function run(filename) {
  // const content = await read(filename);
  
  // const topics = JSON.parse(content);
  // const tweets = topics.map(generateTweets);

  const secrets = await read('secrets.json');
  const token = JSON.parse(secrets).bearer;

  const res = await tweet('wat', token);
  console.log(res);

}

run('content.json');
