import { Veikals } from '../../services/veikals';
export { Veikals, Kaste } from '../../services/veikals';

export interface UploadRow extends Veikals {
}

export const TABLE_COLUMNS: string[] = [
    'kods', 'adrese', 'yellow', 'rose', 'white'
]