import { TimeStamps } from './timestamps';

export interface PaytraqProducts {
  product: PaytraqProduct[];
}

export interface PaytraqProduct {
  itemID: number;
  name: string;
  unit: Unit;
  hasImage: boolean;
  status: number;
  type: number;
  orderLeadTime: number;
  group: Group;
  hasLots: boolean;
  taxKeys: TaxKeysOrAccounts;
  accounts: TaxKeysOrAccounts;
  timeStamps: TimeStamps;
}
export interface Unit {
  unitID: number;
  unitName: string;
}
export interface Group {
  groupID: number;
  groupName: string;
}
export interface TaxKeysOrAccounts {}
