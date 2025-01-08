import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom, Observable } from 'rxjs';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  constructor(private dialog: MatDialog) {}

  confirm(prompt: string, config: MatDialogConfig = {}): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...config,
      data: {
        yes: 'Jā!',
        no: 'Nē!',
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
      },
    });
  }

  confirmDelete(): Promise<boolean> {
    return firstValueFrom(this.dialog.open(ConfirmDeleteComponent).afterClosed());
  }

  async confirmDataError(message?: string): Promise<boolean> {
    return firstValueFrom(
      this.confirm(message || 'Radusies problēma ar serveri. Mēģiniet vēlreiz vēlāk vai sazinieties ar atbalstu', {
        data: {
          title: 'Kļūda!',
          yes: 'OK',
          no: undefined,
        },
      }),
    );
  }
}
