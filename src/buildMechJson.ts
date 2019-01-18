import { camelCase } from 'lodash';
import { Constants, IArmorAttributes, IMech, IWeapon, SlotKey } from './types';
import {
  convertToNumber,
  getKeyValue,
  isArmorAttribute,
  isAttributeKey,
  isChassisAttribute,
  isConfigAttribute,
  isSlotsAttribute,
  isTemperatureAttribute,
  lineContains,
} from './util';

const addInfo = (lines: string[], mech: IMech) => {
  const [_, version] = getKeyValue(lines[0]);

  mech.info = {
    model: lines[2],
    name: lines[1],
    version,
  };
};

const addConfig = (lines: string[], mech: IMech) => {
  lines.forEach((line, index) => {
    const [key, value] = getKeyValue(line);

    if (index === 0) {
      mech.config.configuration = value;
    } else {
      const camelized = camelCase(key);

      if (isConfigAttribute(camelized)) {
        mech.config[camelized] =
          key === 'Rules Level' ? convertToNumber(value) || 0 : value;
      }
    }
  });
};

const addChassis = (lines: string[], mech: IMech) => {
  lines.forEach(line => {
    const [key, value] = getKeyValue(line);
    const camelized = camelCase(key);
    const num = convertToNumber(value);

    if (isChassisAttribute(camelized)) {
      if (camelized === 'mass' && num) {
        mech.chassis[camelized] = num;
      } else {
        mech.chassis[camelized] = value;
      }
    }
  });
};

const addTemperature = (lines: string[], mech: IMech) => {
  lines.forEach((line, index) => {
    const [key, value] = getKeyValue(line);
    const camelized = camelCase(key);

    if (index === 0) {
      const [countRaw, type] = value.split(' ');
      const count = convertToNumber(countRaw);

      if (count) {
        mech.temperature.heatSinksCount = count;
      }
      mech.temperature.heatSinksType = type;
    } else if (isTemperatureAttribute(camelized)) {
      const num = convertToNumber(value);

      if (num) {
        mech.temperature[camelized] = num;
      }
    }
  });
};

const addArmor = (lines: string[], mech: IMech) => {
  lines.forEach((line, index) => {
    const [key, value] = getKeyValue(line);
    const camelized = camelCase(key) as keyof IArmorAttributes;
    const num = convertToNumber(value);

    if (index === 0) {
      mech.armor.type = value;
    } else if (isArmorAttribute(camelized) && num) {
      mech.armor[camelized] = num;
    }
  });
};

const addWeapon = (line: string): IWeapon => {
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

const addWeapons = (lines: string[], mech: IMech) => {
  lines.forEach((line, index) => {
    if (index > 0) {
      const weaponObject = addWeapon(line);

      mech.weapons.push(weaponObject);
    }
  });
};

const addSlots = (lines: string[], mech: IMech) => {
  const slots: string[] = [];

  lines.forEach((line, index) => {
    if (index === 0) {
      const [key] = getKeyValue(line);
      const camelized = camelCase(key);

      if (isSlotsAttribute(camelized)) {
        mech.slots[camelized] = slots;
      }
    } else if (line !== '-Empty-') {
      slots.push(line);
    }
  });
};

const addAttributesToMech = (lines: string[], mech: IMech) => {
  const firstLine = lines[0];

  if (lineContains(firstLine, 'Version')) {
    return addInfo(lines, mech);
  }

  if (lineContains(firstLine, 'Config')) {
    return addConfig(lines, mech);
  }

  if (lineContains(firstLine, 'Mass')) {
    return addChassis(lines, mech);
  }

  if (lineContains(firstLine, 'Heat Sinks')) {
    return addTemperature(lines, mech);
  }

  if (lineContains(firstLine, 'Armor')) {
    return addArmor(lines, mech);
  }

  if (lineContains(firstLine, 'Weapons')) {
    return addWeapons(lines, mech);
  }

  addSlots(lines, mech);

  return mech;
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
  const groups = groupLinesByAttribute(lines);

  const mech: IMech = {
    armor: {
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
    },
    chassis: {
      engine: Constants.NOT_AVAILABLE,
      mass: 0,
      myomer: Constants.NOT_AVAILABLE,
      structure: Constants.NOT_AVAILABLE,
    },
    config: {
      configuration: Constants.NOT_AVAILABLE,
      era: Constants.NOT_AVAILABLE,
      rulesLevel: 0,
      techBase: Constants.NOT_AVAILABLE,
    },
    info: {
      model: Constants.NOT_AVAILABLE,
      name: Constants.NOT_AVAILABLE,
      version: Constants.NOT_AVAILABLE,
    },
    slots: {
      centerTorso: [],
      head: [],
      leftArm: [],
      leftLeg: [],
      leftTorso: [],
      rightArm: [],
      rightLeg: [],
      rightTorso: [],
    },
    temperature: {
      heatSinksCount: 0,
      heatSinksType: Constants.NOT_AVAILABLE,
      jumpMp: 0,
      walkMp: 0,
    },
    weapons: [],
  };

  groups.forEach(group => addAttributesToMech(group, mech));

  return mech;
};
