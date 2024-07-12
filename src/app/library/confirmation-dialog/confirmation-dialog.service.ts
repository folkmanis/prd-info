import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  constructor(private dialog: MatDialog) {}

  confirm(prompt: string, config: MatDialogConfig = {}): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...config,
      data: {
        yes: 'JĀ!',
        no: 'NĒ!',
        ...(config.data || {}),
        prompt,
      },
    });
    return firstValueFrom(dialogRef.afterClosed());
  }

  discardChanges(): Promise<boolean> {
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

  async confirmDataError(message?: string): Promise<void> {
    await this.confirm(message || 'Radusies problēma ar serveri. Mēģiniet vēlreiz vēlāk vai sazinieties ar atbalstu', {
      data: {
        title: 'Kļūda!',
        yes: 'OK',
        no: undefined,
      },
    });
  }
}
