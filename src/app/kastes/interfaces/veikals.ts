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
    loading?: boolean;
    pending?: boolean;
};

export type Kaste = { [key in Colors]: number; } & {
    total: number;
    gatavs: boolean;
    uzlime: boolean;
};

