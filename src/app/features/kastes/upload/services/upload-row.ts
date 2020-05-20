import { Veikals } from '../../services/veikals';
export { Veikals, Kaste } from '../../services/veikals';

export type UploadRow = Veikals;

export const TABLE_COLUMNS: string[] = [
    'kods', 'adrese', 'yellow', 'rose', 'white'
];
