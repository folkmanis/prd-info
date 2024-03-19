import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EMPTY, Observable, firstValueFrom, mergeMap } from 'rxjs';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';

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

  confirmDelete(): Promise<boolean> {
    return firstValueFrom(this.dialog.open(ConfirmDeleteComponent).afterClosed());
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
      mergeMap(() => EMPTY),
    );
  }

}
