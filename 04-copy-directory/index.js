const { mkdir, copyFile, readdir, unlink, writeFile } = require('fs/promises');
const path = require('path');

const copyDir = async (folderName) => {
  try {
    await mkdir(path.join(__dirname, `${folderName}-copy`), {
      recursive: true,
    });

    const data = await readdir(path.join(__dirname, folderName));

    for (let item of data) {
      const filePath = path.join(__dirname, `${folderName}-copy`, item);

      await writeFile(filePath, '');

      await unlink(filePath);

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
