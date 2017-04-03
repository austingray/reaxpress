import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../..', 'skeleton.js');

const templateString = skeleton => `module.exports = ${JSON.stringify(skeleton)};`;

const write = (contents) => {
  fs.writeFileSync(filePath, templateString(contents));
};

export default write;
