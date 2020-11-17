import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UserFormSource } from '../services/user-form-source';
import { IFormControl } from '@rxweb/types';
import { XmfCustomer } from 'src/app/interfaces/xmf-search';
import { EMPTY, Observable } from 'rxjs';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordChangeDialogComponent } from '../password-change-dialog/password-change-dialog.component';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, CanComponentDeactivate {

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private usersService: UsersService,
    @Inject(APP_PARAMS) private params: AppParams,
    ) { }

  userFormSource = new UserFormSource(this.fb, this.usersService);
  customers$: Observable<XmfCustomer[]> = this.usersService.xmfCustomers$;
  userModules = this.params.userModules;

  get username(): IFormControl<string> {
    return this.userFormSource.form.controls.username as IFormControl<string>;
  }

  ngOnInit(): void {
  }

  canDeactivate(): boolean {
    return this.userFormSource.form.pristine;
  }

  onPasswordChange(username: string) {
    this.dialog.open(PasswordChangeDialogComponent, {
      width: '300px',
      data: { username },
    }).afterClosed().pipe(
      mergeMap(result => result ? this.usersService.updatePassword(username, result) : EMPTY),
    ).subscribe(resp => {
      if (resp) {
        this.snackBar.open(`Parole nomainita!`, 'OK', { duration: 3000 });
      }
    });
  }



}
