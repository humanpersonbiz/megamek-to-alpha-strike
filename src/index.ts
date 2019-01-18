import * as fs from 'fs';
import buildMechJson from './buildMechJson';
import { IMech } from './types';
import { makeJsonFilename } from './util';

const inDirectory = 'inFiles';
const outDirectory = 'outFiles';

const getData = (filename: string): Promise<string> =>
  new Promise((resolve, reject) =>
    fs.readFile(`./${inDirectory}/${filename}`, 'utf-8', (err, data) =>
      err ? reject(err) : resolve(data),
    ),
  );

const writeMechFile = (mech: IMech, filename: string) =>
  new Promise((resolve, reject) =>
    fs.writeFile(
      `./${outDirectory}/${filename}`,
      JSON.stringify(mech, null, 2),
      err => (err ? reject(err) : resolve()),
    ),
  );

const getDataAndBuildMech = async (filename: string) => {
  try {
    const [data, jsonFilename] = await Promise.all([
      getData(filename),
      makeJsonFilename(filename),
    ]);
    const mech = buildMechJson(data);

    return writeMechFile(mech, jsonFilename);
  } catch (error) {
    console.error(error);
  }
};

const filenames = fs.readdirSync(inDirectory);

export default Promise.all(filenames.map(getDataAndBuildMech));
