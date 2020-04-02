import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component";
import { switchMap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
    })
  }

}
