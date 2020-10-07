import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { XmfCustomer } from 'src/app/interfaces/xmf-search';
import { UsersService } from '../../services/users.service';
import { Validator } from '../../services/validator';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit, CanComponentDeactivate {

  newUserForm = new FormGroup({
    username: new FormControl(null, Validator.username(), Validator.usernameAsync(this.usersService)),
    password: new FormControl(null, Validator.password()),
    name: new FormControl(null, Validators.required),
    admin: new FormControl(false),
    preferences: new FormGroup({
      customers: new FormControl(),
      modules: new FormControl(),
    }),
  });
  username = this.newUserForm.get('username');
  password = this.newUserForm.get('password');
  name = this.newUserForm.get('name');
  hide = true; // Paroles ievades laukam

  customers$: Observable<XmfCustomer[]> = this.usersService.xmfCustomers$;
  constructor(
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogService: ConfirmationDialogService,
    @Inject(APP_PARAMS) private params: AppParams,
  ) { }

  userModules = this.params.userModules;

  ngOnInit() {
  }

  onSave() {
    const username: string = this.username.value;
    this.usersService.addUser(this.newUserForm.value).subscribe(resp => {
      if (resp) {
        this.newUserForm.markAsPristine();
        this.snackBar.open(`Lietotājs ${username} izveidots!`, 'OK', { duration: 3000 });
        this.router.navigate(['admin', 'users', 'edit', { id: username }]);
      } else {
        this.snackBar.open(`Neizdevās izveidot lietotāju`, 'OK', { duration: 5000 });
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.newUserForm.pristine ? true : this.dialogService.discardChanges();
  }

}

