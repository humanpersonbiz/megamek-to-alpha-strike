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

export type Attribute = string | string[] | {};
export type AttributeFunction<K = AttributeKeys> = (
  lines: string[],
) => {
  key: K;
  obj: WeaponsAttribute | IAttributeObject;
};
export interface IAttributeObject {
  [key: string]: Attribute;
}
export interface IWeapon {
  ammo?: number;
  weapon: string;
  quantity?: number;
  slot: SlotKey;
}
export type WeaponsAttribute = IWeapon[];
export interface IMech {
  info?: IAttributeObject;
  config?: IAttributeObject;
  mass?: IAttributeObject;
  chassis?: IAttributeObject;
  temperature?: IAttributeObject;
  armor?: IAttributeObject;
  weapons?: WeaponsAttribute;
  slots: {} | IAttributeObject;
}
