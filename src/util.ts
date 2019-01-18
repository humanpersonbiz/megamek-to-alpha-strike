import {
  AttributeIndicator,
  AttributeKeys,
  Constants,
  IArmorAttributes,
  IChassisAttributes,
  IConfigAttributes,
  ISlotsAttributes,
  ITemperatureAttributes,
} from './types';

// Helper functions

export const getKeyValue = (line: undefined | string) =>
  line ? line.split(':') : [Constants.NOT_AVAILABLE];

export const convertToNumber = (value: string) => {
  const num = parseInt(value, 10);

  if (/\D/g.test(value) || isNaN(num)) {
    return null;
  }

  return num;
};

export const lineContains = (line: string, indicator: AttributeIndicator) =>
  line.indexOf(indicator) >= 0;

export const makeJsonFilename = (filename: string) =>
  filename.replace(/\W/g, '_').replace('_mtf', '.json');

// Validators

export const isAttributeKey = (line: string): line is AttributeKeys =>
  !line || line === '';

export const isConfigAttribute = (
  value: string,
): value is keyof IConfigAttributes =>
  value === 'configuration' ||
  value === 'era' ||
  value === 'rulesLevel' ||
  value === 'techBase';

export const isChassisAttribute = (
  value: string,
): value is keyof IChassisAttributes =>
  value === 'engine' ||
  value === 'mass' ||
  value === 'myomer' ||
  value === 'structure';
export const isTemperatureAttribute = (
  value: string,
): value is keyof ITemperatureAttributes =>
  value === 'heatSinksCount' ||
  value === 'heatSinksType' ||
  value === 'jumpMp' ||
  value === 'walkMp';
export const isArmorAttribute = (
  value: string,
): value is keyof IArmorAttributes =>
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
export const isSlotsAttribute = (
  value: string,
): value is keyof ISlotsAttributes =>
  value === 'centerTorso' ||
  value === 'head' ||
  value === 'leftArm' ||
  value === 'leftLeg' ||
  value === 'leftTorso' ||
  value === 'rightArm' ||
  value === 'rightLeg' ||
  value === 'rightTorso';
