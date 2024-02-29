import { Colors } from './kastes-colors';

export interface Veikals {
    _id: string;
    kods: number;
    adrese: string;
    pasutijums: number;
    kastes: Kaste[];
    lastModified: string;
}

export type VeikalsKaste = Veikals & {
    kastes: Kaste;
    kaste: number;
};

export type Kaste = Record<Colors, number> & {
    total: number;
    gatavs: boolean;
    uzlime: boolean;
};

