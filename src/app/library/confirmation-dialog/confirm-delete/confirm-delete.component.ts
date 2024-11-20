import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-delete',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './confirm-delete.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDeleteComponent {}
