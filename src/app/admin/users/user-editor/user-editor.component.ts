import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserModule, AppParams } from 'src/app/interfaces';
import { XmfCustomer } from 'src/app/interfaces/xmf-search';
import { UsersService } from '../../services/users.service';
import { User } from 'src/app/interfaces';
import { debounceTime, distinctUntilChanged, switchMap, filter, tap, map, takeUntil } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { PasswordChangeDialogComponent } from './password-change-dialog/password-change-dialog.component';
import { CanComponentDeactivate } from '../../../library/guards/can-deactivate.guard';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { APP_PARAMS } from 'src/app/app-params';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.css'],
  providers: [DestroyService],
})
export class UserEditorComponent implements OnInit, CanComponentDeactivate {

  userForm = new FormGroup({
    username: new FormControl(),
    name: new FormControl(),
    admin: new FormControl(),
    preferences: new FormGroup({
      customers: new FormControl(),
      modules: new FormControl(),
    }),
  });

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: ConfirmationDialogService,
    private destroy$: DestroyService,
    @Inject(APP_PARAMS) private params: AppParams,
  ) { }

  userModules = this.params.userModules;

  customers$: Observable<XmfCustomer[]> = this.usersService.xmfCustomers$;

  user$ = this.route.paramMap.pipe(
    map((params: ParamMap) => params.get('id')),
    switchMap(username => this.usersService.getUser(username)),
    tap(user => this.setFormValues(user)),
  );

  ngOnInit() {
    this.userForm.valueChanges.pipe(
      debounceTime(500),
      switchMap((form: Partial<User>) => this.usersService.updateUser(form)),
      tap(result => result && this.userForm.markAsPristine()),
      takeUntil(this.destroy$),
    ).subscribe();

  }

  onDelete(username: string) {
    this.dialogService.confirm(`Tiešām dzēst lietotāju ${username}?`).pipe(
      filter(resp => resp),
      switchMap(() => this.usersService.deleteUser(username)),
    ).subscribe(resp => {
      if (resp) {
        this.snackBar.open(`Lietotājs ${username} likvidēts`, 'OK', { duration: 5000 });
      }
      this.router.navigate(['admin', 'users']);
    });
  }

  onPasswordChange(username: string) {
    this.dialog.open(PasswordChangeDialogComponent, {
      width: '300px',
      data: { username },
    }).afterClosed().pipe(
      filter(result => result),
      switchMap(result => this.usersService.updatePassword(username, result)),
    ).subscribe(resp => {
      if (resp) {
        this.snackBar.open(`Parole nomainita!`, 'OK', { duration: 3000 });
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.userForm.pristine ? true : this.dialogService.discardChanges();
  }

  private setFormValues(usr: Partial<User> | null) {
    if (!usr) { return; }
    this.userForm.setValue({
      username: usr.username,
      name: usr.name,
      admin: usr.admin,
      preferences: {
        customers: usr.preferences.customers,
        modules: usr.preferences.modules || [],
      }
    }, { emitEvent: false });
  }

}
