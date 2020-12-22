const fs = require('fs');
const { promisify } = require('util');
const read = promisify(fs.readFile);

async function run(filename) {
  const content = await read(filename);
  console.log(JSON.parse(content));
}

run('content.json');
