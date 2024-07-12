import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEqual, pickBy } from 'lodash-es';
import { Observable, map, of } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { User, UserSession } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library';
import { AppClassTransformerService } from 'src/app/library/class-transformer/app-class-transformer.service';
import { navigateRelative } from 'src/app/library/common';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { PasswordInputDirective } from 'src/app/library/password-input';
import { PasswordInputGroupComponent } from 'src/app/library/password-input/password-input-group/password-input-group.component';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { LoginService } from 'src/app/login';
import { XmfCustomer } from 'src/app/xmf-search/interfaces';
import { UsersService } from '../../services/users.service';
import { UsersListComponent } from '../users-list/users-list.component';
import { SessionsComponent } from './sessions/sessions.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SessionsComponent,
    PasswordInputDirective,
    SimpleFormContainerComponent,
    PasswordInputGroupComponent,
    AsyncPipe,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatCardModule,
    MatButtonModule,
    MatInput,
    MatCheckbox,
  ],
})
export class UserEditComponent implements CanComponentDeactivate {

  private navigate = navigateRelative();

  private usersList = inject(UsersListComponent);

  customers$: Observable<XmfCustomer[]> = this.usersService.getXmfCustomers();

  userModules = getAppParams('userModules');

  sessions = signal<UserSession[] | null>(null);

  currentSessionId$ = inject(LoginService).getSessionId();

  form = new FormGroup({
    username: new FormControl(
      '',
      [Validators.required, usernamePatternValidator],
      [this.existingUsernameValidator()]
    ),
    name: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    last_login: new FormControl<Date>({ value: new Date(), disabled: true }),
    userDisabled: new FormControl(false),
    eMail: new FormControl(''),
    preferences: new FormGroup({
      customers: new FormControl([]),
      modules: new FormControl([]),
    }),
  });

  user = input.required<User>();

  initialValue = computed(() => this.transformer.instanceToPlain(this.user()) as User);

  private formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  changes = computed(() => {
    const value = this.formValue();
    const initialValue = this.initialValue();
    const diff = pickBy(value, (v, key) => !isEqual(v, initialValue[key]));
    return Object.keys(diff).length ? diff : undefined;
  });

  get isNew() {
    return !this.initialValue().username;
  }

  get unameCtrl() {
    return this.form.controls.username;
  }

  constructor(
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private confirmationDialog: ConfirmationDialogService,
    private transformer: AppClassTransformerService
  ) {
    effect(() => {
      const initialValue = this.initialValue();
      this.sessions.set(initialValue.sessions);
      this.form.reset(initialValue);
      if (initialValue.username) {
        this.form.controls.password.disable();
      }
    }, {
      allowSignalWrites: true,
    });
  }

  canDeactivate(): boolean {
    return this.form.pristine || !this.changes();
  }

  onReset() {
    this.form.reset(this.initialValue());
  }

  async onSave() {
    if (this.isNew) {
      const newUser = pickBy(this.form.getRawValue(), (val) => val !== null);
      const { username } = await this.usersService.addUser(newUser);
      this.afterUserSaved(username);
    } else {
      const update = { ...this.changes(), username: this.initialValue().username };
      const { username } = await this.usersService.updateUser(update);
      this.afterUserSaved(username);
    }
  }

  async onPasswordChange(password: string, username: string) {
    try {
      await this.usersService.updatePassword(username, password);
      this.snackBar.open(`Lietotāja ${username} parole nomainita!`, 'OK', { duration: 3000 });
    } catch (err) {
      this.snackBar.open(`Paroli nomainīt neizdevās`, 'OK', { duration: 5000, });
    }
  }

  async onDeleteUser(username: string) {
    const confirmation = await this.confirmationDialog.confirmDelete();
    if (!confirmation) {
      return;
    }

    try {
      await this.usersService.deleteUser(username);
      this.snackBar.open(`Lietotājs izdzēsts`, 'OK', { duration: 5000 });
      this.usersList.onReload();
      this.form.markAsPristine();
      this.navigate(['..']);
    } catch (error) {
      this.snackBar.open(`Neizdevās izdzēst`, 'OK', { duration: 5000 });
    }

  }

  async onDeleteSessions(sessionIds: string[], username: string) {

    if (await this.confirmationDialog.confirmDelete() !== true) {
      return;
    }

    try {
      const deletedSessionsCount = await this.usersService.deleteSessions(username, sessionIds);
      const user = await this.usersService.getUser(username);
      this.sessions.set(user.sessions);
      this.snackBar.open(`Deleted ${deletedSessionsCount} sessions`, 'OK', { duration: 5000 });
    } catch (err) {
      this.snackBar.open(`Neizdevās izdzēst`, 'OK', { duration: 5000 });
    }
  }

  async onUploadToFirestore(username: string) {
    try {
      await this.usersService.uploadToFirestore(username);
      this.snackBar.open('Dati saglabāti lietotnē', 'OK', { duration: 5000 });
    } catch (err) {
      this.snackBar.open(`Neizdevās saglabāt. Kļūda ${err?.message}`, 'OK');
    }
  }

  private async afterUserSaved(username: string) {
    this.usersList.onReload();
    this.form.markAsPristine();
    this.navigate(['..', username]);
  }

  private existingUsernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl<string>): Observable<ValidationErrors> => {
      if (control.value === this.initialValue()?.username) {
        return of(null);
      } else {
        return this.usersService
          .validateUsername(control.value)
          .pipe(
            map((valid) => (valid ? null : { existing: 'Esošs lietotājvārds' }))
          );
      }
    };
  }


}

function usernamePatternValidator(control: AbstractControl): ValidationErrors {
  const val: string = control.value || '';
  if (val.match(/ /)) {
    return { symbol: 'Atstarpi nedrīkst izmantot' };
  }
  return null;
}
