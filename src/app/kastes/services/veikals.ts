export interface Veikals {
    kods: number;
    adrese: string;
    pasutijums: string;
    kastes: Kaste[];
}

export interface Kaste {
    total: number;
    yellow: number;
    rose: number;
    white: number;
    gatavs: boolean;
    uzlime: boolean;
}