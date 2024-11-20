import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { isEqual, pick } from 'lodash-es';
import { User } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { LoginService } from 'src/app/login';
import { PasswordInputDirective } from '../library/password-input';
import { DEMO_MODE } from '../services/app-mode.provider';
import { GoogleInfoComponent } from './google-info/google-info.component';

type UserUpdate = Pick<User, 'name' | 'eMail'>;

const NO_USER: UserUpdate = { name: '', eMail: '' };

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, GoogleInfoComponent, MatDividerModule, MatButtonModule, PasswordInputDirective]
})
export class UserSettingsComponent implements CanComponentDeactivate {
  private loginService = inject(LoginService);
  private snackService = inject(MatSnackBar);

  private initialValue = computed(() => pick(this.user() || NO_USER, 'name', 'eMail'));

  userForm = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required]],
    eMail: ['', [Validators.email]],
  });

  isDemo = inject(DEMO_MODE);

  user = toSignal(this.loginService.user$);

  formValue = toSignal(this.userForm.valueChanges, { initialValue: this.userForm.value });

  isChanged = computed(() => !isEqual(this.formValue(), this.initialValue()));

  returnPath = inject(ActivatedRoute).snapshot.url.join('%2F');

  canDeactivate = () => !this.isChanged() || this.userForm.pristine;

  constructor() {
    effect(() => this.userForm.reset(this.initialValue()));
  }

  async onSave() {
    try {
      await this.loginService.updateUser(this.formValue());
      this.snack('Dati saglabāti');
    } catch (error) {
      this.snack('Neizdevās saglabāt');
    }
  }

  onReset() {
    this.userForm.reset(this.initialValue());
  }

  async onPasswordChange(password: string) {
    try {
      await this.loginService.updateUser({ password });
      this.snack('Parole nomainīta!');
    } catch (error) {
      this.snack('Neizdevās nomainīt paroli!');
    }
  }

  async onDeleteGoogle() {
    try {
      await this.loginService.updateUser({ google: null });
      this.snack('Google savienojums dzēsts');
    } catch (error) {
      this.snack('Neizdevās izpildīt darbību!');
    }
  }

  onGoogleValueClicked([key, value]: [string, string]) {
    switch (key) {
      case 'name':
        this.userForm.controls.name.setValue(value);
        break;

      case 'email':
        this.userForm.controls.eMail.setValue(value);
        break;

      default:
        return;
    }
    this.userForm.markAsDirty();
  }

  private snack(msg: string) {
    this.snackService.open(msg, 'OK', { duration: 3000 });
  }
}
