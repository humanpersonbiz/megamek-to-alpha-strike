import { camelCase } from 'lodash';
import {
  AttributeFunction,
  AttributeKeys,
  IAttributeObject,
  IMech,
  IWeapon,
  SlotKey,
  WeaponsAttribute,
} from './types';
import {
  convertToNumber,
  getKeyValue,
  isAttributeKey,
  lineContains,
} from './util';

const buildInfoAttribute: AttributeFunction<AttributeKeys.INFO> = (
  lines: string[],
) => {
  const [_, version] = getKeyValue(lines[0]);
  const info: IAttributeObject = {
    model: lines[2],
    name: lines[1],
    version,
  };

  return { key: AttributeKeys.INFO, obj: info };
};

const buildConfigAttribute: AttributeFunction<AttributeKeys.CONFIG> = (
  lines: string[],
) => {
  const config: IAttributeObject = {};

  lines.forEach((line, index) => {
    const [key, value] = getKeyValue(line);
    if (index === 0) {
      config.configuration = value;
    } else {
      const camelized = camelCase(key);

      config[camelized] =
        key === 'Rules Level' ? convertToNumber(value) : value;
    }
  });

  return { key: AttributeKeys.CONFIG, obj: config };
};

const buildChassisAttribute: AttributeFunction<AttributeKeys.CHASSIS> = (
  lines: string[],
) => {
  const chassis: IAttributeObject = {};

  lines.forEach(line => {
    const [key, value] = getKeyValue(line);
    const camelized = camelCase(key);

    chassis[camelized] = convertToNumber(value);
  });

  return { key: AttributeKeys.CHASSIS, obj: chassis };
};

const buildTemperatureAttribute: AttributeFunction<
  AttributeKeys.TEMPERATURE
> = (lines: string[]) => {
  const temperature: IAttributeObject = {};

  lines.forEach((line, index) => {
    const [key, value] = getKeyValue(line);
    const camelized = camelCase(key);

    if (index === 0) {
      const [count, type] = value.split(' ');

      temperature.heatSinksCount = convertToNumber(count);
      temperature.heatSinksType = type;
    } else {
      temperature[camelized] = convertToNumber(value);
    }
  });

  return { key: AttributeKeys.TEMPERATURE, obj: temperature };
};

const buildArmorAttribute: AttributeFunction<AttributeKeys.ARMOR> = (
  lines: string[],
) => {
  const armor: IAttributeObject = {};

  lines.forEach((line, index) => {
    const [key, value] = getKeyValue(line);
    const camelized = camelCase(key);

    if (index === 0) {
      armor.type = value;
    } else {
      armor[camelized] = convertToNumber(value);
    }
  });

  return { key: AttributeKeys.ARMOR, obj: armor };
};

const buildWeaponObject = (line: string): IWeapon => {
  const [weapon, slot, possibleAmmo] = line.split(/,\s/g);
  const weaponObject: IWeapon = { slot: camelCase(slot) as SlotKey, weapon };

  const [_, ammoValue] = getKeyValue(possibleAmmo);
  const ammo = convertToNumber(ammoValue);
  const quantity = convertToNumber(weapon[0]);

  if (typeof ammo === 'number') {
    weaponObject.ammo = ammo;
  }

  if (typeof quantity === 'number') {
    weaponObject.quantity = quantity;
    weaponObject.weapon = weapon.slice(1).trim();
  }

  return weaponObject;
};

const buildWeaponsAttribute: AttributeFunction<AttributeKeys.WEAPONS> = (
  lines: string[],
) => {
  const weapons: WeaponsAttribute = [];

  lines.forEach((line, index) => {
    if (index > 0) {
      const weaponObject = buildWeaponObject(line);

      weapons.push(weaponObject);
    }
  });

  return { key: AttributeKeys.WEAPONS, obj: weapons };
};

const addSlotToSlotsObject = (
  lines: string[],
  slotsObject: IAttributeObject,
) => {
  const slots: string[] = [];

  lines.forEach((line, index) => {
    if (index === 0) {
      const [key] = getKeyValue(line);
      const camelized = camelCase(key);

      slotsObject[camelized] = slots;
    } else if (line !== '-Empty-') {
      slots.push(line);
    }
  });
};

const buildIAttributeObject = (
  lines: string[],
  slotsObject: IAttributeObject,
) => {
  const firstLine = lines[0];

  if (lineContains(firstLine, 'Version')) {
    return buildInfoAttribute(lines);
  }

  if (lineContains(firstLine, 'Config')) {
    return buildConfigAttribute(lines);
  }

  if (lineContains(firstLine, 'Mass')) {
    return buildChassisAttribute(lines);
  }

  if (lineContains(firstLine, 'Heat Sinks')) {
    return buildTemperatureAttribute(lines);
  }

  if (lineContains(firstLine, 'Armor')) {
    return buildArmorAttribute(lines);
  }

  if (lineContains(firstLine, 'Weapons')) {
    return buildWeaponsAttribute(lines);
  }

  addSlotToSlotsObject(lines, slotsObject);

  return null;
};

const groupLinesByAttribute = (lines: string[]) => {
  const groups: string[][] = [];
  let groupIndex = 0;

  lines.forEach((line, lineIndex) => {
    if (line) {
      const lastLine = lines[lineIndex - 1];

      if (isAttributeKey(lastLine)) {
        groups[groupIndex] = [line];

        groupIndex++;
      } else if (Array.isArray(groups[groupIndex - 1])) {
        groups[groupIndex - 1].push(line);
      }
    }
  });

  return groups;
};

export default (data: string) => {
  const lines = data.split(`\r\n`);
  const attributeArrays = groupLinesByAttribute(lines);

  const slots: IAttributeObject = {};
  const attributes = attributeArrays.map(attributeArray =>
    buildIAttributeObject(attributeArray, slots),
  );

  return attributes.reduce(
    (accumulator, current) => {
      if (accumulator && current) {
        const { key, obj } = current;

        accumulator[key] = obj;
      }

      return accumulator;
    },
    { slots } as IMech,
  );
};
