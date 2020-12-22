const fs = require('fs');
const { promisify } = require('util');
const write = promisify(fs.writeFile);

async function run(filename) {
  const content = {
    name: 'batman',
    power: 'money',
    weakness: 'parents'
  };

  await write(filename, JSON.stringify(content, null, 2));
};

run('content.json');