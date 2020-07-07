import { VeikalsBox } from './veikals-box';

export interface Veikals {
    kods: number;
    adrese: string;
    pasutijums: string;
    kastes: VeikalsBox[];
}
