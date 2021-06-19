import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { combineLatest, EMPTY, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, mergeMap, share, shareReplay, switchMap, tap } from 'rxjs/operators';
import { UsersService } from 'src/app/admin/services/users.service';
import { User, UserSession } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsComponent {

  private userId$ = new ReplaySubject<string>();

  private _userId: string;
  @Input() set userId(value: string) {
    this._userId = value;
    this.userId$.next(this.userId);
  }
  get userId(): string {
    return this._userId;
  }

  sessions$ = this.userId$.pipe(
    switchMap(id => this.userService.getUser(id)),
    map(user => user.sessions || []),
  );

  isActiveUser$: Observable<boolean> = combineLatest([
    this.userId$,
    this.loginService.user$,
  ]).pipe(
    map(([id, current]) => current.username === id),
  );

  constructor(
    private userService: UsersService,
    private confirmationDialog: ConfirmationDialogService,
    private snack: MatSnackBar,
    private loginService: LoginService,
  ) { }

  onDelete(sessionId: string) {
    this.confirmationDialog.confirmDelete().pipe(
      mergeMap(resp => resp ? this.userService.deleteSession(sessionId) : EMPTY),
      tap(_ => this.userId$.next(this.userId)),
    )
      .subscribe(resp => this.snack.open(`Deleted ${resp} sessions`, 'OK', { duration: 5000 }));
  }

  onDeleteAll() {
    this.confirmationDialog.confirmDelete().pipe(
      mergeMap(resp => resp ? this.userService.updateUser({ username: this.userId, sessions: [] }) : EMPTY),
      tap(_ => this.userId$.next(this.userId)),
    )
      .subscribe(_ => this.snack.open(`All user sessions deleted`, 'OK', { duration: 5000 }));
  }


}
