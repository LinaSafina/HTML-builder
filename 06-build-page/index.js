const {
  readFile,
  mkdir,
  writeFile,
  readdir,
  unlink,
  copyFile,
} = require('fs/promises');
const path = require('path');

let template = '';
let tags = [];

const readTemplateFile = async (fileName) => {
  try {
    template = await readFile(path.join(__dirname, fileName), {
      encoding: 'utf-8',
    });
  } catch (err) {
    console.log(err);
  }
};

const searchTags = (string, startSearch = 0, endSearch = 0) => {
  const start = string.indexOf('{{', startSearch);
  const end = string.indexOf('}}', endSearch);

  if (start !== -1 && end !== -1) {
    const tag = string.slice(start, end + 2);
    tags.push(tag);
    return searchTags(string, start + 2, end + 3);
  }

  return;
};

const replaceTags = async (string, tags) => {
  try {
    for (let tag of tags) {
      const data = await readFile(
        path.join(__dirname, 'components', `${tag.slice(2, -2)}.html`),
        { encoding: 'utf-8' }
      );
      string = string.replace(tag, data);
    }

    return string;
  } catch (err) {
    console.log(err);
  }
};

const writeTemplateFile = async (folderPath, data) => {
  try {
    await mkdir(folderPath, {
      recursive: true,
    });
    await writeFile(path.join(folderPath, 'index.html'), data);
  } catch (err) {
    console.log(err);
  }
};

const mergeStyles = async (folderPath) => {
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

  try {
    const fullData = await readStyleFolder(path.join(__dirname, 'styles'));

    await writeFile(folderPath, fullData);
  } catch (err) {
    console.log(err);
  }
};

const copyDir = async (folderPath, newFolderPath) => {
  try {
    await mkdir(newFolderPath, {
      recursive: true,
    });

    const data = await readdir(folderPath, {
      withFileTypes: true,
    });

    for (let item of data) {
      const itemPath = path.join(folderPath, item.name);
      const newItemPath = path.join(newFolderPath, item.name);

      if (item.isFile()) {
        await writeFile(newItemPath, '');
        await unlink(newItemPath);
        await copyFile(itemPath, newItemPath);
      } else {
        await copyDir(itemPath, newItemPath);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const buildPage = async () => {
  try {
    await readTemplateFile('template.html');
    searchTags(template);
    template = await replaceTags(template, tags);
    await writeTemplateFile(path.join(__dirname, 'project-dist'), template);
    await mergeStyles(path.join(__dirname, 'project-dist', 'style.css'));
    await copyDir(
      path.join(__dirname, 'assets'),
      path.join(__dirname, 'project-dist', 'assets')
    );

    console.log('Your project was built successfully!');
  } catch (err) {
    console.log(err);
  }
};

buildPage();
