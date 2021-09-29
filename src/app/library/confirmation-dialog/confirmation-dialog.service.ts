import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  constructor(
    private dialog: MatDialog,
  ) { }

  confirm(prompt: string, config: MatDialogConfig = {}): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...config, data: { ...(config.data || {}), prompt },
    });
    return dialogRef.afterClosed();
  }

  discardChanges(): Observable<boolean> {
    return this.confirm('Vai tiešām vēlaties pamest nesaglabātu?', {
      data: {
        yes: 'Jā, pamest!',
        no: 'Nē, turpināt!',
      }
    });
  }

  confirmDelete(): Observable<boolean> {
    return this.confirm('Tiešām vēlaties izdzēst?', {
      data: {
        yes: 'Jā, izdzēst',
        no: 'Tomēr nē',
      }
    });
  }

  confirmDataError(message: string): Observable<boolean> {
    return this.confirm('Radusies problēma ar serveri. Mēģiniet vēlreiz vēlāk vai sazinieties ar atbalstu',
      {
        data: {
          yes: 'OK'
        }
      }
    );
  }

}
