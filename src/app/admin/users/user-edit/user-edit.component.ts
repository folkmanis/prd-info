import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UserFormSource } from '../services/user-form-source';
import { IFormControl } from '@rxweb/types';
import { XmfCustomer } from 'src/app/interfaces/xmf-search';
import { EMPTY, from, Observable, of } from 'rxjs';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams, User, UserSession } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordChangeDialogComponent } from '../password-change-dialog/password-change-dialog.component';
import { concatMap, map, mapTo, mergeMap, reduce, switchMap, tap, throwIfEmpty } from 'rxjs/operators';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { ConfirmationDialogService } from 'src/app/library';
import { LoginService } from 'src/app/services';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: SimpleFormSource, useExisting: UserFormSource },
  ]
})
export class UserEditComponent implements OnInit, CanComponentDeactivate {

  customers$: Observable<XmfCustomer[]> = this.usersService.xmfCustomers$;
  userModules = this.params.userModules;
  sessions: UserSession[] | null = null;
  currentSessionId$ = this.loginService.sessionId$;

  form: FormGroup;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private formSource: UserFormSource,
    private confirmationDialog: ConfirmationDialogService,
    private chDetector: ChangeDetectorRef,
    private loginService: LoginService,
    @Inject(APP_PARAMS) private params: AppParams,
  ) { }

  get isNew() {
    return this.formSource.isNew;
  }

  get username(): IFormControl<string> {
    return this.formSource.form.controls.username as IFormControl<string>;
  }

  onDataChange(obj: User) {
    this.formSource.initValue(obj);
    this.sessions = obj.sessions || null;
  }

  ngOnInit(): void {
    this.form = this.formSource.form;
  }

  canDeactivate(): boolean {
    return this.formSource.form.pristine;
  }

  onPasswordChange(username: string) {
    this.dialog.open(PasswordChangeDialogComponent, {
      width: '300px',
      data: { username },
    }).afterClosed().pipe(
      mergeMap(result => result ? this.usersService.updatePassword(username, result) : EMPTY),
    ).subscribe({
      next: (user) => this.snackBar.open(`Lietotāja ${user.username} parole nomainita!`, 'OK', { duration: 3000 }),
      error: () => this.snackBar.open(`Paroli nomainīt neizdevās`, 'OK', { duration: 5000 }),
    }

    );
  }

  onDeleteSessions(sessionIds: string[]) {
    const uname = this.username.value;
    this.confirmationDialog.confirmDelete().pipe(
      mergeMap(resp => resp ? of(sessionIds) : EMPTY),
      mergeMap(ids => this.usersService.deleteSessions(uname, ids)),
      switchMap(count => this.usersService.getUser(uname).pipe(
        tap(u => this.sessions = u.sessions),
        mapTo(count),
      )),
    )
      .subscribe(resp => {
        this.snackBar.open(`Deleted ${resp} sessions`, 'OK', { duration: 5000 });
        this.chDetector.markForCheck();
      });
  }


}
