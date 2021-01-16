import { AppHttpResponseBase } from 'src/app/library/http';

export const COLORS = ['rose', 'yellow', 'white'] as const;

export const MAX_ITEMS_BOX = 5;

export type Colors = typeof COLORS[number];

export interface ColorTotals {
    color: Colors;
    total: number;
}

export interface Kaste {
    _id: string;
    kods: number | string;
    adrese: string;
    pasutijums: string;
    kastes: { [key in Colors]: number; } & {
        gatavs: boolean;
        total: number;
        uzlime: boolean;
    };
    kaste: number;
    lastModified: string;
    loading?: boolean;
}

export interface Totals {
    total: number;
    kastes: number;
    labels: number;
    colorTotals: ColorTotals[];
}

export interface KasteResponse extends AppHttpResponseBase<Kaste> {
    apjomi?: number[];
    userPreferences?: KastesUserPreferences;
}

export interface RowUpdate {
    rw: Kaste;
    field: 'gatavs' | 'uzlime';
    yesno: boolean;
}

export interface KastesUserPreferences {
    pasutijums: number;
}

export type VeikalsBox = { [key in Colors]: number; } & {
    total: number;
    gatavs: boolean;
    uzlime: boolean;
};

export interface Veikals {
    kods: number;
    adrese: string;
    pasutijums: number;
    kastes: VeikalsBox[];
}
