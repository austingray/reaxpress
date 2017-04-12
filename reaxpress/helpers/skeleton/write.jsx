import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'custom.jsx');

const templateString = skeleton =>
`export default ${JSON.stringify(skeleton)};`;

const write = (contents) => {
  fs.writeFileSync(filePath, templateString(contents));
};

export default write;
