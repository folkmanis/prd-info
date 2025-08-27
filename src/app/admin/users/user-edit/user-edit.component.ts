import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isEqual, pickBy } from 'lodash-es';
import { getAppParams } from 'src/app/app-params';
import { User } from 'src/app/interfaces';
import { ConfirmationDialogService, stringOrThrow } from 'src/app/library';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { PasswordInputDirective } from 'src/app/library/password-input';
import { PasswordInputGroupComponent } from 'src/app/library/password-input/password-input-group/password-input-group.component';
import { promiseToSignal } from 'src/app/library/rxjs';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { LoginService } from 'src/app/login';
import { UsersListComponent } from '../users-list/users-list.component';
import { UsersService } from '../users.service';
import { SessionsComponent } from './sessions/sessions.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SessionsComponent,
    PasswordInputDirective,
    SimpleFormContainerComponent,
    PasswordInputGroupComponent,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatCardModule,
    MatButtonModule,
    MatInput,
    MatCheckbox,
    MatProgressSpinner,
  ],
})
export class UserEditComponent implements CanComponentDeactivate {
  private navigate = navigateRelative();
  private usersList = inject(UsersListComponent);
  private snackBar = inject(MatSnackBar);
  private usersService = inject(UsersService);
  private confirmationDialog = inject(ConfirmationDialogService);

  private username = computed(() => this.initialValue().username);

  protected customers = promiseToSignal(this.usersService.getXmfCustomers());

  protected userModules = getAppParams('userModules');

  protected sessions = this.usersService.getUserSessionsResource(this.username);

  protected currentSessionId = promiseToSignal(inject(LoginService).getSessionId());

  private fb = inject(FormBuilder).nonNullable;
  protected form = this.fb.group({
    username: ['', [Validators.required, this.usernamePatternValidator()], [this.existingUsernameValidator()]],
    name: ['', [Validators.required]],
    password: ['', [Validators.required]],
    userDisabled: [false],
    eMail: [null as string | null, [Validators.required]],
    prefersDarkMode: [false],
    preferences: this.fb.group({
      customers: [[] as string[]],
      modules: [[] as string[]],
    }),
  });

  initialValue = input.required<User>({ alias: 'user' });

  private formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  protected formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  protected changes = computed(() => {
    const value = this.formValue();
    const initialValue = this.initialValue();
    const diff = pickBy(value, (v, key) => !isEqual(v, initialValue[key]));
    return Object.keys(diff).length ? diff : undefined;
  });

  protected isNew = computed(() => !this.initialValue().username);

  get unameCtrl() {
    return this.form.controls.username;
  }

  constructor() {
    effect(() => {
      const initialValue = this.initialValue();
      this.form.reset(initialValue);
      if (initialValue.username) {
        this.form.controls.password.disable();
      }
    });
  }

  canDeactivate(): boolean {
    return this.form.pristine || !this.changes();
  }

  protected onReset() {
    this.form.reset(this.initialValue());
  }

  protected async onSave() {
    if (this.isNew()) {
      const newUser = pickBy(this.form.getRawValue(), (val) => val !== null);
      const { username } = await this.usersService.addUser(newUser);
      this.afterUserSaved(username);
    } else {
      const update = { ...this.changes(), username: this.initialValue().username };
      const { username } = await this.usersService.updateUser(update);
      this.afterUserSaved(username);
    }
  }

  protected async onPasswordChange(password: string) {
    const username = stringOrThrow(this.form.value.username);
    try {
      await this.usersService.updatePassword(username, password);
      this.snackBar.open(`Lietotāja ${username} parole nomainita!`, 'OK', { duration: 3000 });
    } catch (err) {
      this.snackBar.open(`Paroli nomainīt neizdevās`, 'OK', { duration: 5000 });
    }
  }

  protected async onDeleteUser() {
    const username = stringOrThrow(this.form.value.username);
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

  protected async onDeleteSessions(sessionIds: string[]) {
    const username = stringOrThrow(this.form.value.username);
    if ((await this.confirmationDialog.confirmDelete()) !== true) {
      return;
    }

    try {
      const deletedSessionsCount = await this.usersService.deleteSessions(username, sessionIds);
      this.sessions.reload();
      this.snackBar.open(`Deleted ${deletedSessionsCount} sessions`, 'OK', { duration: 5000 });
    } catch (err) {
      this.snackBar.open(`Neizdevās izdzēst`, 'OK', { duration: 5000 });
    }
  }

  protected async onUploadToFirestore() {
    const username = stringOrThrow(this.form.value.username);
    try {
      await this.usersService.uploadToFirestore(username);
      this.snackBar.open('Dati saglabāti lietotnē', 'OK', { duration: 5000 });
    } catch (err) {
      this.snackBar.open(`Neizdevās saglabāt. Kļūda ${err?.message}`, 'OK');
    }
  }

  private afterUserSaved(username: string) {
    this.usersList.onReload();
    this.form.markAsPristine();
    this.navigate(['..', username]);
  }

  private existingUsernameValidator(): AsyncValidatorFn {
    return async ({ value }: AbstractControl<string>) =>
      value === this.initialValue()?.username || (await this.usersService.validateUsername(value)) ? null : { existing: 'Esošs lietotājvārds' };
  }

  private usernamePatternValidator(): ValidatorFn {
    return (control) => {
      const val: string = control.value || '';
      return val.match(/ /) ? { symbol: 'Atstarpi nedrīkst izmantot' } : null;
    };
  }
}
