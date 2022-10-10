import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Colors, VeikalsKaste } from '../../interfaces';
import { KasteDialogComponent } from '../kaste-dialog/kaste-dialog.component';
import { KasteDialogData, KasteDialogResponse } from './kaste-dialog-data';

@Injectable({
  providedIn: 'root'
})
export class KasteDialogService {

  constructor(
    private dialog: MatDialog,
  ) { }

  openDialog(kaste: VeikalsKaste, colorCodes: Record<Colors, string>): Observable<KasteDialogResponse> {
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
