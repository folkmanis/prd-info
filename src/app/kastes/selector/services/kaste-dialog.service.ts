import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
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

  openDialog(data: KasteDialogData): Observable<KasteDialogResponse> {
    const config: MatDialogConfig<KasteDialogData> = {
      data,
      minWidth: '300px',
      minHeight: '500px',
    };
    const dialogRef = this.dialog.open(KasteDialogComponent, config);
    return dialogRef.afterClosed();
  }
}
