import { Observable } from 'rxjs';
import { Colors, VeikalsKaste } from '../../interfaces';

export interface KasteDialogData {
    kaste: VeikalsKaste;
    colorCodes: Record<Colors, string>;
    allKastes: VeikalsKaste[];
}

export enum KASTES_DIALOG_RESPONSE_TYPE {
    gatavs,

}

export interface KasteDialogResponse {
    setGatavs: boolean;
}