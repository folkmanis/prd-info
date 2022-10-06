import { Colors, VeikalsKaste } from '../../interfaces';
import { KastesSettings } from 'src/app/interfaces';
import { Observable } from 'rxjs';

export interface KasteDialogData {
    kaste: VeikalsKaste;
    colorCodes: Record<Colors, string>;
}

export enum KASTES_DIALOG_RESPONSE_TYPE {
    gatavs,

}