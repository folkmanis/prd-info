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

export type KasteColors = { [key in Colors]: number; };

export type Kaste = KasteColors & {
    total: number;
    gatavs: boolean;
    uzlime: boolean;
};

