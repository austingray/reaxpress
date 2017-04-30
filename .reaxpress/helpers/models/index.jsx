import fs from 'fs';
import path from 'path';
import templateNew from './templates/new';

export default {
  create: (name) => {
    // formulate the filename and path
    const filePath = path.join(__dirname, '../../..', `models/${name}.jsx`);

    // bail if the file already exists
    const fileAlreadyExists = fs.existsSync(filePath);

    if (fileAlreadyExists) {
      console.log(`...model file already existed for: ${name}`);
      return;
    }

    // create the file
    const fileContents = templateNew(name);

    try {
      fs.writeFileSync(filePath, fileContents);
    } catch (err) {
      throw new Error(err);
    }

    // get the model index path
    const modelIndexPath = path.join(__dirname, '../../..', 'models/index.jsx');

    // get the model index contents
    const modelIndexContents = fs.readFileSync(modelIndexPath, 'utf8')
      .replace(
        /\/\/ end of #reaxpress imports/g,
        `import ${name.charAt(0).toUpperCase() + name.slice(1)} from './${name}';\n// end of #reaxpress imports`,
      ).replace(
        /\/\/ end of #reaxpress models/g,
        `${name.charAt(0).toUpperCase() + name.slice(1)},\n  // end of #reaxpress models`,
      );

    try {
      fs.writeFileSync(modelIndexPath, modelIndexContents);
      console.log('...successfully created model');
    } catch (err) {
      throw new Error(err);
    }
  },
};
