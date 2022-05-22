const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'));

const chunk = [];

readableStream.on('data', (data) => chunk.push(data));
readableStream.on('end', () => console.log(chunk.join('')));
readableStream.on('error', (error) => console.log(error.message));
