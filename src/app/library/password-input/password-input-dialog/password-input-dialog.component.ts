import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PasswordInputGroupComponent } from '../password-input-group/password-input-group.component';

export interface PasswordDialogData {
  minLength?: number;
}

@Component({
  selector: 'app-password-input-dialog',
  templateUrl: './password-input-dialog.component.html',
  styleUrls: ['./password-input-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, MatDialogModule, MatButton, PasswordInputGroupComponent],
  standalone: true,
})
export class PasswordInputDialogComponent {
  #data: PasswordDialogData = inject(MAT_DIALOG_DATA);

  #passwordModel = signal({ password: '' });
  protected passwordForm = form(this.#passwordModel, (s) => {
    required(s.password);
    if (this.#data.minLength) {
      minLength(s.password, this.#data.minLength, { message: `Jābūt vismaz ${this.#data.minLength} simboliem` });
    }
  });
}
