const { readdir, readFile, writeFile } = require('fs/promises');
const path = require('path');

const readStyleFiles = async (filePath) => {
  try {
    return await readFile(filePath, { encoding: 'utf-8' });
  } catch (err) {
    console.log(err);
  }
};

const readStyleFolder = async (folderPath) => {
  try {
    const files = await readdir(folderPath, { withFileTypes: true });
    const filteredFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css'
    );
    const fullData = [];

    for (let file of filteredFiles) {
      const data = await readStyleFiles(path.join(folderPath, file.name));
      fullData.push(data);
    }

    return fullData;
  } catch (err) {
    console.log(err);
  }
};

const mergeStyles = async (folderPath) => {
  try {
    const fullData = await readStyleFolder(path.join(__dirname, 'styles'));
    await writeFile(folderPath, fullData);

    console.log('Styles have been merged successfully!');
  } catch (err) {
    console.log(err);
  }
};

mergeStyles(path.join(__dirname, 'project-dist', 'bundle.css'));
