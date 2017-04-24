import fs from 'fs';
import exists from './exists';
import templates from './templates';
import getRouteFilePath from './getRouteFilePath';

export default (args) => {
  const consoleLog = [];

  // get the status of the routes
  const routesExist = exists(args);

  // get the fs path to the route file
  const routeFilePath = getRouteFilePath(args);

  // init an empty string for route file contents
  let routeFileContents = '';

  // determine if the route file already exists
  const fileAlreadyExists = fs.existsSync(routeFilePath);

  // if the file exists, use that instead
  if (fileAlreadyExists) {
    routeFileContents = fs.readFileSync(routeFilePath, 'utf8');
    consoleLog.push(`...route file already existed for: ${args.parent}`);
  }

  // if the parent does not exist, and we won't be overwriting a file
  if (routesExist.parent === false && fileAlreadyExists === false) {
    const parentRouteContent = templates.parent(args);
    routeFileContents = parentRouteContent;
    consoleLog.push(`...creating a new route file for: ${args.parent}`);
  }

  // if the child does not exist, let's add it to the routeFileContents
  if (routesExist.child === false) {
    const childRouteContent = templates.child(args);
    routeFileContents = routeFileContents.replace(
      /\/\/ #reaxpress custom components/g,
      `import ${args.component} from '../src/react/${args.component}'\n// #reaxpress custom components;`,
    );
    routeFileContents = routeFileContents.replace(
      /\/\/ end of #reaxpress routes/g,
      `${childRouteContent}\n// end of #reaxpress routes`,
    );
    consoleLog.push(`...adding child route for: ${args.child}`);
  }

  try {
    fs.writeFileSync(routeFilePath, routeFileContents);
    consoleLog.push(`...wrote route code to file: ${routeFilePath}`);
  } catch (err) {
    throw new Error(err);
  }

  for (let i = 0; i < consoleLog.length; i += 1) {
    console.log(consoleLog[i]);
  }
};
