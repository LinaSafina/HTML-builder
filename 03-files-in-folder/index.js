const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const getFileInfo = (name) => {
  fs.stat(path.join(__dirname, 'secret-folder', name), (err, stats) => {
    let size = null;
    if (err) {
      size = 'unknown';
    }
    size = stats.size;
    console.log(
      `${path.basename(name, path.extname(name))} - ${path
        .extname(name)
        .slice(1)} - ${size}b`
    );
  });
};

fsPromises
  .readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
  .then((data) => {
    data
      .filter((item) => item.isFile())
      .forEach((file) => {
        getFileInfo(file.name);
      });
  })
  .catch((err) => console.log(err));
