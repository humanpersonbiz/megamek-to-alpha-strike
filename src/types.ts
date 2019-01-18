export enum AttributeKeys {
  INFO = 'info',
  CONFIG = 'config',
  CHASSIS = 'chassis',
  TEMPERATURE = 'temperature',
  ARMOR = 'armor',
  WEAPONS = 'weapons',
  SLOTS = 'slots',
}
export type AttributeIndicator =
  | 'Version'
  | 'Config'
  | 'Mass'
  | 'Heat Sinks'
  | 'Armor'
  | 'Weapons'
  | SlotIndicator;
export type SlotKey =
  | 'leftArm'
  | 'rightArm'
  | 'leftTorso'
  | 'rightTorso'
  | 'centerTorso'
  | 'head'
  | 'leftLeg'
  | 'rightLeg';
export type SlotIndicator =
  | 'Left Arm'
  | 'Right Arm'
  | 'Left Torso'
  | 'Right Torso'
  | 'Center Torso'
  | 'Head'
  | 'Left Leg'
  | 'Right Leg';

export interface IMech {
  info?: IInfoAttributes;
  config?: IConfigAttributes;
  chassis?: IChassisAttributes;
  temperature?: ITemperatureAttributes;
  armor?: IArmorAttributes;
  weapons?: WeaponsAttribute;
  slots?: ISlotsAttributes;
}

export interface IInfoAttributes {
  model: string;
  name: string;
  version: string;
}

export interface IConfigAttributes {
  configuration: string;
  techBase: string;
  era: string;
  rulesLevel: number;
}

export interface IChassisAttributes {
  mass: number;
  engine: string;
  structure: string;
  myomer: string;
}

export interface ITemperatureAttributes {
  heatSinksCount: number;
  heatSinksType: string;
  walkMp: number;
  jumpMp: number;
}

export interface IArmorAttributes {
  type: string;
  laArmor: number;
  raArmor: number;
  ltArmor: number;
  rtArmor: number;
  ctArmor: number;
  hdArmor: number;
  llArmor: number;
  rlArmor: number;
  rtlArmor: number;
  rtrArmor: number;
  rtcArmor: number;
}

export interface IWeapon {
  ammo?: number;
  weapon: string;
  quantity?: number;
  slot: SlotKey;
}

export type WeaponsAttribute = IWeapon[];

export interface ISlotsAttributes {
  leftArm: string[];
  rightArm: string[];
  leftTorso: string[];
  rightTorso: string[];
  centerTorso: string[];
  head: string[];
  leftLeg: string[];
  rightLeg: string[];
}

export type Attributes =
  | IInfoAttributes
  | IConfigAttributes
  | IChassisAttributes
  | ITemperatureAttributes
  | IArmorAttributes
  | WeaponsAttribute
  | ISlotsAttributes;

export type AttributeFunction<K = AttributeKeys> = (
  lines: string[],
) => {
  key: K;
  obj: Attributes;
};
export interface IAttributes {
  [AttributeKeys.ARMOR]: Attributes;
}

export const enum Constants {
  NOT_AVAILABLE = 'not-available',
}
