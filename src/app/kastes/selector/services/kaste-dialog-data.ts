import { Colors, VeikalsKaste } from '../../interfaces';

export interface KasteDialogData {
    kaste: VeikalsKaste;
    colorCodes: Record<Colors, string>;
}

export enum KASTES_DIALOG_RESPONSE_TYPE {
    gatavs,

}

export interface KasteDialogResponse {
    setGatavs: boolean;
}