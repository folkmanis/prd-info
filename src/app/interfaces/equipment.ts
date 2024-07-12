export class Equipment {
  _id: string;

  name: string = '';

  description: string = '';
}

export type EquipmentPartial = Pick<Equipment, '_id' | 'name'>;
