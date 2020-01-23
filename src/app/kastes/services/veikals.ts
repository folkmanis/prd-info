export interface Veikals {
    kods: string;
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