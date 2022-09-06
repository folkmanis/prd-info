import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { EMPTY, map, merge, mergeMap, Observable, of, switchMap, takeUntil, tap } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { User, UserSession } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { LoginService } from 'src/app/login';
import { XmfCustomer } from 'src/app/xmf-search/interfaces';
import { UsersService } from '../../services/users.service';
import { UserFormService } from '../services/user-form.service';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UserFormService,
    DestroyService,
  ]
})
export class UserEditComponent implements OnInit, CanComponentDeactivate {

  customers$: Observable<XmfCustomer[]> = this.usersService.xmfCustomers$;
  userModules = getAppParams('userModules');
  sessions: UserSession[] | null = null;
  currentSessionId$ = this.loginService.sessionId$;

  form = this.formService.form;

  get changes(): Partial<User> | null {
    return this.formService.changes;
  }

  get isNew() {
    return this.formService.isNew;
  }

  get unameCtrl() {
    return this.form.controls.username;
  }

  constructor(
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    private formService: UserFormService,
    private confirmationDialog: ConfirmationDialogService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private destroy$: DestroyService,
    private changeDetector: ChangeDetectorRef,
  ) { }


  ngOnInit(): void {

    this.route.data.pipe(
      map(data => data.value as User),
      takeUntil(this.destroy$),
    ).subscribe(user => this.formService.setInitial(user));

    merge(this.form.valueChanges, this.form.statusChanges).pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => this.changeDetector.markForCheck());

  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

  onReset() {
    this.formService.reset();
  }

  onSave() {
    this.formService.save()
      .subscribe(u => this.router.navigate(['..', u.username], { relativeTo: this.route }));
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
        tap(u => this.sessions = u.sessions),
        map(() => count),
      )),
    )
      .subscribe(resp => {
        this.snackBar.open(`Deleted ${resp} sessions`, 'OK', { duration: 5000 });
        this.changeDetector.markForCheck();
      });
  }


}
