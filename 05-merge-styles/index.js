const { readdir, readFile, writeFile } = require('fs/promises');
const path = require('path');

const chunks = [];

const readFiles = async (filePath) => {
  try {
    const data = await readFile(filePath, { encoding: 'utf-8' });

    chunks.push(data);
  } catch (err) {
    console.log(err);
  }
};

const readFolder = async (folderPath) => {
  try {
    const files = await readdir(folderPath, { withFileTypes: true });
    const filteredFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css'
    );

    for (let file of filteredFiles) {
      await readFiles(path.join(folderPath, file.name));
    }
  } catch (err) {
    console.log(err);
  }
};

const writeFiles = async (folderPath) => {
  try {
    await readFolder(path.join(__dirname, 'styles'));
    await writeFile(folderPath, chunks);
  } catch (err) {
    console.log(err);
  }
};

writeFiles(path.join(__dirname, 'project-dist', 'bundle.css'));
