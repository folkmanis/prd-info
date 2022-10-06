import { Injectable } from '@angular/core';
import { Colors, VeikalsKaste } from '../../interfaces';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { KasteDialogData } from './kaste-dialog-data';
import { Observable } from 'rxjs';
import { KasteDialogComponent } from '../kaste-dialog/kaste-dialog.component';
import { getKastesPreferences } from '../../services/kastes-preferences.service';

@Injectable({
  providedIn: 'root'
})
export class KasteDialogService {

  constructor(
    private dialog: MatDialog,
  ) { }

  openDialog(kaste: VeikalsKaste, colorCodes: Record<Colors, string>): Observable<unknown> {
    const config: MatDialogConfig<KasteDialogData> = {
      data: {
        kaste,
        colorCodes,
      },
      minWidth: '300px',
      minHeight: '400px',
    };
    const dialogRef = this.dialog.open(KasteDialogComponent, config);
    return dialogRef.afterClosed();
  }
}
