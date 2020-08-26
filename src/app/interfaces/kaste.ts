import { AppHttpResponseBase } from 'src/app/library/http';
import { KastesUserPreferences } from '../kastes/interfaces/kastes-user-preferences';

export type Colors = 'yellow' | 'rose' | 'white';

export interface ColorTotals {
    color: Colors;
    total: number;
}

export interface Kaste {
    _id: string;
    kods: number | string;
    adrese: string;
    pasutijums: string;
    kastes: {
        yellow: number;
        rose: number;
        white: number;
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
    kastesRemain: number;
    labelsRemain: number;
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
