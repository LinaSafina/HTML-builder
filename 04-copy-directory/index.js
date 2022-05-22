const { mkdir, copyFile, readdir, unlink } = require('fs/promises');
const path = require('path');

const copyDir = async (folderName) => {
  try {
    await mkdir(path.join(__dirname, `${folderName}-copy`), {
      recursive: true,
    });
    console.log('created');
    const data = await readdir(path.join(__dirname, folderName), {
      withFileTypes: true,
    });

    data.map((item) => {
      unlink(path.join(__dirname, `${folderName}-copy`, item.name), (err) => {
        if (err) throw err;
      });
      copyFile(
        path.join(__dirname, folderName, item.name),
        path.join(__dirname, `${folderName}-copy`, item.name),
        0,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

copyDir('files');
