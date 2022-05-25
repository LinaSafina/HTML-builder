const { mkdir, copyFile, readdir, unlink } = require('fs/promises');
const path = require('path');

const copyDir = async (folderName) => {
  try {
    const newFolderPath = path.join(__dirname, `${folderName}-copy`);
    await mkdir(newFolderPath, {
      recursive: true,
    });

    const copiedFiles = await readdir(newFolderPath);

    for (const file of copiedFiles) {
      unlink(path.join(newFolderPath, file));
    }

    const data = await readdir(path.join(__dirname, folderName));

    for (let item of data) {
      const filePath = path.join(__dirname, `${folderName}-copy`, item);

      await copyFile(
        path.join(__dirname, folderName, item),
        path.join(filePath)
      );
    }

    console.log('Your folder has been copied!');
  } catch (err) {
    console.log(err);
  }
};

copyDir('files');
