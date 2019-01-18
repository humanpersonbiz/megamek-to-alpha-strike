import { camelCase } from 'lodash';
import {
  AttributeFunction,
  AttributeKeys,
  Constants,
  IArmorAttributes,
  IChassisAttributes,
  IConfigAttributes,
  IInfoAttributes,
  IMech,
  ISlotsAttributes,
  ITemperatureAttributes,
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
  const info: IInfoAttributes = {
    model: lines[2],
    name: lines[1],
    version,
  };

  return { key: AttributeKeys.INFO, obj: info };
};

const isConfigAttribute = (value: string): value is keyof IConfigAttributes =>
  value === 'configuration' ||
  value === 'era' ||
  value === 'rulesLevel' ||
  value === 'techBase';

const buildConfigAttribute: AttributeFunction<AttributeKeys.CONFIG> = (
  lines: string[],
) => {
  const config: IConfigAttributes = {
    configuration: Constants.NOT_AVAILABLE,
    era: Constants.NOT_AVAILABLE,
    rulesLevel: 0,
    techBase: Constants.NOT_AVAILABLE,
  };

  lines.forEach((line, index) => {
    const [key, value] = getKeyValue(line);

    if (index === 0) {
      config.configuration = value;
    } else {
      const camelized = camelCase(key);

      if (isConfigAttribute(camelized)) {
        config[camelized] =
          key === 'Rules Level' ? convertToNumber(value) || 0 : value;
      }
    }
  });

  return { key: AttributeKeys.CONFIG, obj: config };
};

const isChassisAttribute = (value: string): value is keyof IChassisAttributes =>
  value === 'engine' ||
  value === 'mass' ||
  value === 'myomer' ||
  value === 'structure';

const buildChassisAttribute: AttributeFunction<AttributeKeys.CHASSIS> = (
  lines: string[],
) => {
  const chassis: IChassisAttributes = {
    engine: Constants.NOT_AVAILABLE,
    mass: 0,
    myomer: Constants.NOT_AVAILABLE,
    structure: Constants.NOT_AVAILABLE,
  };

  lines.forEach(line => {
    const [key, value] = getKeyValue(line);
    const camelized = camelCase(key);
    const num = convertToNumber(value);

    if (isChassisAttribute(camelized) && num) {
      chassis[camelized] = num;
    }
  });

  return { key: AttributeKeys.CHASSIS, obj: chassis };
};

const isTemperatureAttribute = (
  value: string,
): value is keyof ITemperatureAttributes =>
  value === 'heatSinksCount' ||
  value === 'heatSinksType' ||
  value === 'jumpMp' ||
  value === 'walkMp';

const buildTemperatureAttribute: AttributeFunction<
  AttributeKeys.TEMPERATURE
> = (lines: string[]) => {
  const temperature: ITemperatureAttributes = {
    heatSinksCount: 0,
    heatSinksType: Constants.NOT_AVAILABLE,
    jumpMp: 0,
    walkMp: 0,
  };

  lines.forEach((line, index) => {
    const [key, value] = getKeyValue(line);
    const camelized = camelCase(key);

    if (index === 0) {
      const [countRaw, type] = value.split(' ');
      const count = convertToNumber(countRaw);

      if (count) {
        temperature.heatSinksCount = count;
      }
      temperature.heatSinksType = type;
    } else if (isTemperatureAttribute(camelized)) {
      const num = convertToNumber(value);

      if (num) {
        temperature[camelized] = num;
      }
    }
  });

  return { key: AttributeKeys.TEMPERATURE, obj: temperature };
};

const isArmorAttribute = (value: string): value is keyof IArmorAttributes =>
  value === 'ctArmor' ||
  value === 'hdArmor' ||
  value === 'laArmor' ||
  value === 'llArmor' ||
  value === 'ltArmor' ||
  value === 'raArmor' ||
  value === 'rlArmor' ||
  value === 'rtArmor' ||
  value === 'rtcArmor' ||
  value === 'rtlArmor' ||
  value === 'rtrArmor' ||
  value === 'type';

const buildArmorAttribute: AttributeFunction<AttributeKeys.ARMOR> = (
  lines: string[],
) => {
  const armor: IArmorAttributes = {
    ctArmor: 0,
    hdArmor: 0,
    laArmor: 0,
    llArmor: 0,
    ltArmor: 0,
    raArmor: 0,
    rlArmor: 0,
    rtArmor: 0,
    rtcArmor: 0,
    rtlArmor: 0,
    rtrArmor: 0,
    type: Constants.NOT_AVAILABLE,
  };

  lines.forEach((line, index) => {
    const [key, value] = getKeyValue(line);
    const camelized = camelCase(key) as keyof IArmorAttributes;
    const num = convertToNumber(value);

    if (index === 0) {
      armor.type = value;
    } else if (isArmorAttribute(camelized) && num) {
      armor[camelized] = num;
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

const isSlotsAttribute = (value: string): value is keyof ISlotsAttributes =>
  value === 'centerTorso' ||
  value === 'head' ||
  value === 'leftArm' ||
  value === 'leftLeg' ||
  value === 'leftTorso' ||
  value === 'rightArm' ||
  value === 'rightLeg' ||
  value === 'rightTorso';

const addSlotToSlotsObject = (
  lines: string[],
  slotsObject: ISlotsAttributes,
) => {
  const slots: string[] = [];

  lines.forEach((line, index) => {
    if (index === 0) {
      const [key] = getKeyValue(line);
      const camelized = camelCase(key);

      if (isSlotsAttribute(camelized)) {
        slotsObject[camelized] = slots;
      }
    } else if (line !== '-Empty-') {
      slots.push(line);
    }
  });
};

const buildIAttributes = (lines: string[], slotsObject: ISlotsAttributes) => {
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

  const slots: ISlotsAttributes = {
    centerTorso: [],
    head: [],
    leftArm: [],
    leftLeg: [],
    leftTorso: [],
    rightArm: [],
    rightLeg: [],
    rightTorso: [],
  };
  const attributes = attributeArrays.map(attributeArray =>
    buildIAttributes(attributeArray, slots),
  );

  return attributes.reduce(
    (mech, currentAttribute) => {
      if (mech && currentAttribute) {
        const { key, obj } = currentAttribute;

        switch (key) {
          case AttributeKeys.INFO:
            mech[key] = obj;

            break;

          default:
            break;
        }
      }

      return mech;
    },
    { slots } as IMech,
  );
};
