export interface IAlphaStrikeMech {
  info: {
    model: string;
    name: string;
  };
  attributes: {
    title: string;
    pointValue: IAttribute;
    type: IAttribute;
    size: IAttribute;
    totalMovementModifier: IAttribute;
    movement: IAttribute;
    role: IAttribute;
    skill: IAttribute;
    era: IAttribute;
  };
  damage: {
    tite: string;
    short: IDamage;
    medium: IDamage;
    long: IDamage;
  };
  heat: {
    title: string;
    overload: IHeat;
    heatScale: IHeat;
  };
  special: {
    title: string;
    field: string;
  };
  armor: {
    title: string;
    count: IArmor;
    structure: IArmor;
  };
  crits: {
    title: string;
    mobilityPoints: IArmor;
    fireControl: IArmor;
    weapons: IArmor;
    engine: IArmor;
  };
}

export interface IAttribute {
  label: string;
  field: string;
}

export interface IDamage {
  label: string;
  field: string;
}

export type HeatScale = 1 | 2 | 3 | 4;
export interface IHeat {
  label: string;
  field: string | HeatScale;
}

export interface IArmor {
  label: string;
  field: string;
}

export interface ICrits {
  label: string;
  count: number;
  modifier: number;
  modifierLabel: string;
}
