import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { GoogleInfoComponent } from './google-info/google-info.component';


type UserUpdate = Pick<User, 'name' | 'eMail'>;

const NO_USER: UserUpdate = { name: '', eMail: '' };

@Component({
  selector: 'app-user-settings',
  standalone: true,
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    GoogleInfoComponent,
    MatDividerModule,
    MatButtonModule,
    PasswordInputDirective,
  ]
})
export class UserSettingsComponent implements CanComponentDeactivate {

  userForm = new FormGroup({
    name: new FormControl(
      '',
      [Validators.required]
    ),
    eMail: new FormControl(
      '',
      [Validators.email]
    )
  });


  user = toSignal(this.loginService.user$);

  private _initialUser: UserUpdate = NO_USER;
  get initialUser() {
    return this._initialUser;
  }
  set initialUser(value: UserUpdate) {
    this._initialUser = value;
    this.userForm.reset(this.initialUser);
  }

  returnPath = this.route.snapshot.url.join('%2F');

  canDeactivate = () => !this.isChanged || this.userForm.pristine;

  private snack = (msg: string) => this.snackService.open(msg, 'OK', { duration: 3000 });

  constructor(
    private loginService: LoginService,
    private snackService: MatSnackBar,
    private route: ActivatedRoute,
  ) {
    effect(() => this.initialUser = pick(this.user() || NO_USER, 'name', 'eMail'));
  }

  get isChanged(): boolean {
    return !isEqual(this.userForm.value, this.initialUser);
  }

  onSave(userFormValue: UserUpdate) {
    this.loginService.updateUser(userFormValue)
      .subscribe({
        next: () => this.snack('Dati saglabāti'),
        error: () => this.snack('Neizdevās saglabāt'),
      });
  }

  onReset() {
    this.userForm.reset(this.initialUser);
  }

  onPasswordChange(password: string) {
    this.loginService.updateUser({ password })
      .subscribe({
        next: () => this.snack('Parole nomainīta!'),
        error: () => this.snack('Neizdevās nomainīt paroli!'),
      });
  }

  onDeleteGoogle() {
    this.loginService.updateUser({ google: null }).subscribe();
  }

  onGoogleValueClicked([key, value]: [string, string]) {
    switch (key) {
      case 'name':
        this.userForm.patchValue({ name: value });
        break;

      case 'email':
        this.userForm.patchValue({ eMail: value });
        break;

      default:
        return;
    }
    this.userForm.markAsDirty();
  }


}
