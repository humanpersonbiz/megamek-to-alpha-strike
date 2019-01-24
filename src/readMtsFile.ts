import { readdirSync, readFileSync, writeFileSync } from 'fs';
import convertMtsToMegamek from './convertMtsToMegamek';
import { IMech } from './types';
import { makeJsonFilename } from './util';

export default async () => {
  const inDirectory = 'inFiles';
  const outDirectory = 'outFiles';

  const getData = (filename: string) =>
    readFileSync(`./${inDirectory}/${filename}`, 'utf-8');

  const writeMechFile = (mech: IMech, filename: string) => {
    writeFileSync(
      `./${outDirectory}/${filename}`,
      JSON.stringify(mech, null, 2),
    );

    return mech;
  };

  const getDataAndBuildMech = async (filename: string) => {
    try {
      const [data, jsonFilename] = await Promise.all([
        getData(filename),
        makeJsonFilename(filename),
      ]);
      const mech = convertMtsToMegamek(data);

      return writeMechFile(mech, jsonFilename);
    } catch (error) {
      console.error(error);
    }
  };

  const filenames = readdirSync(inDirectory);

  const mechs = await Promise.all(filenames.map(getDataAndBuildMech));

  return mechs;
};
