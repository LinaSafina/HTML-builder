const { createWriteStream } = require('fs');
const fs = require('fs');
const path = require('path');

const writableStream = createWriteStream(path.join(__dirname, 'text.txt'));
fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) {
    console.log(err);
  }

  process.stdout.write('Привет! Введи что-нибудь ниже: \n');
});

process.stdin.on('data', (data) => {
  console.log(data);
  if (data.toString().trim() === 'exit') {
    process.exit();
  }

  writableStream.write(data.toString(), () => {});
});

process.on('SIGINT', function () {
  process.exit(0);
});

process.on('error', (err) => {
  console.log(err);
});

process.on('exit', () => {
  console.log('До новых встреч!');
});
