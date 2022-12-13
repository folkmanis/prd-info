import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { EMPTY, Observable } from 'rxjs';
import { mergeMapTo } from 'rxjs/operators';
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
      ...config,
      data: {
        yes: 'JĀ!',
        no: 'NĒ!',
        ...(config.data || {}),
        prompt,
      },
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

  confirmDataError(message?: string): Observable<never> {
    return this.confirm(message || 'Radusies problēma ar serveri. Mēģiniet vēlreiz vēlāk vai sazinieties ar atbalstu',
      {
        data: {
          title: 'Kļūda!',
          yes: 'OK',
          no: undefined,
        }
      }
    ).pipe(
      mergeMapTo(EMPTY),
    );
  }

}
