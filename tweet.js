const fs = require('fs');
const { promisify } = require('util');
const read = promisify(fs.readFile);
const Markov = require('js-markov');

function generateTweets([ topic, tweets ]) {
  const chain = new Markov();
  chain.addStates(tweets);
  chain.train(3);

  return topic + ':\n\n' + chain.generateRandom(240 - topic.length - 3);
}

async function run(filename) {
  const content = await read(filename);
  const topics = JSON.parse(content);

  const tweets = topics.map(generateTweets);
  
  for (let i = 0; i < tweets.length; i++) {
    const element = tweets[i];
    
    console.log(element);
  }
}

run('content.json');
