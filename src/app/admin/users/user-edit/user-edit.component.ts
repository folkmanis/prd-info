import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual, pickBy } from 'lodash-es';
import { EMPTY, Observable, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { User, UserSession } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { PasswordInputDirective } from 'src/app/library/password-input';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { LoginService } from 'src/app/login';
import { XmfCustomer } from 'src/app/xmf-search/interfaces';
import { UsersService } from '../../services/users.service';
import { SessionsComponent } from './sessions/sessions.component';
import { AppClassTransformerService } from 'src/app/library/class-transformer/app-class-transformer.service';


@Component({
  selector: 'app-user-edit',
  standalone: true,
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MaterialLibraryModule,
    ReactiveFormsModule,
    SessionsComponent,
    PasswordInputDirective,
    SimpleFormContainerComponent,
  ]
})
export class UserEditComponent implements CanComponentDeactivate {

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
    name: new FormControl(
      '',
      [Validators.required],
    ),
    password: new FormControl(
      '',
      [Validators.required],
    ),
    last_login: new FormControl<Date>({ value: new Date(), disabled: true }),
    userDisabled: new FormControl(false),
    eMail: new FormControl(''),
    preferences: new FormGroup({
      customers: new FormControl([]),
      modules: new FormControl([]),
    }),
  });

  private _initialValue = new User();
  get initialValue() {
    return this._initialValue;
  }
  set initialValue(value: User) {
    this._initialValue = this.transformer.instanceToPlain(value) as User;
    this.sessions.set(this.initialValue.sessions);
    this.form.reset(this.initialValue);
    this.form.controls.password.disable();
  }

  private routerData = toSignal(this.route.data);

  private formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  formStatus = toSignal(this.form.statusChanges, { initialValue: this.form.status });

  changes = computed(() => {
    const value = this.formValue();
    const diff = pickBy(value, (v, key) => !isEqual(v, this.initialValue[key]));
    return Object.keys(diff).length ? diff : undefined;
  });

  get isNew() {
    return !this.initialValue.username;
  }

  get unameCtrl() {
    return this.form.controls.username;
  }

  constructor(
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private confirmationDialog: ConfirmationDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private transformer: AppClassTransformerService,
  ) {
    effect(
      () => this.initialValue = this.routerData().user || new User(),
      { allowSignalWrites: true }
    );
    effect(() => console.log(this.changes()));
  }


  canDeactivate(): boolean {
    return this.form.pristine || !this.changes();
  }

  onReset() {
    this.form.reset(this.initialValue);
  }

  onSave() {

    if (this.isNew) {
      return this.usersService.addUser(this.form.getRawValue())
        .subscribe(user => {
          this.form.markAsPristine();
          this.router.navigate(['..', user.username], { relativeTo: this.route });
        });
    } else {
      const update = { ...this.changes(), username: this.initialValue.username };
      return this.usersService.updateUser(update)
        .subscribe(user => this.initialValue = user);
    }

  }

  onPasswordChange(password: string, username: string) {
    this.usersService.updatePassword(username, password).subscribe({
      next: (user) => this.snackBar.open(`Lietotāja ${user.username} parole nomainita!`, 'OK', { duration: 3000 }),
      error: () => this.snackBar.open(`Paroli nomainīt neizdevās`, 'OK', { duration: 5000 }),
    });
  }

  onDeleteSessions(sessionIds: string[]) {
    const uname = this.form.value.username;
    this.confirmationDialog.confirmDelete().pipe(
      mergeMap(resp => resp ? of(sessionIds) : EMPTY),
      mergeMap(ids => this.usersService.deleteSessions(uname, ids)),
      switchMap(count => this.usersService.getUser(uname).pipe(
        tap(u => this.sessions.set(u.sessions)),
        map(() => count),
      )),
    )
      .subscribe(resp => {
        this.snackBar.open(`Deleted ${resp} sessions`, 'OK', { duration: 5000 });
      });
  }

  private existingUsernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl<string>): Observable<ValidationErrors> => {
      if (control.value === this.initialValue?.username) {
        return of(null);
      } else {
        return this.usersService.validateUsername(control.value).pipe(
          map(valid => valid ? null : { existing: 'Esošs lietotājvārds' })
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

