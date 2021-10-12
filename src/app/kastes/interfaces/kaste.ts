import { Kaste } from './veikals';

export const MAX_ITEMS_BOX = 5;

export interface RowUpdate {
    rw: Kaste;
    field: 'gatavs' | 'uzlime';
    yesno: boolean;
}

export interface KastesUserPreferences {
    pasutijums: number;
}

