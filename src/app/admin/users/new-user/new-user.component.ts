import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators, ValidationErrors, AsyncValidator, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { UsersService, Customer, UserModule } from '../../services/users.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Validator } from '../../services/validator';
import { CanComponentDeactivate } from "../../../library/guards/can-deactivate.guard";
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
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

  customers$: Observable< Customer[]> = this.usersService.customers$;
  userModules: UserModule[];
  constructor(
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialogService: ConfirmationDialogService,
  ) { }

  ngOnInit() {
    // this.usersService.getCustomers().subscribe((cust) => this.customers = cust);
    this.userModules = this.usersService.getUserModules();
  }

  onSave() {
    const username = this.username.value;
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
    if (this.newUserForm.pristine) {
      return true;
    } else {
      return this.dialogService.discardChanges();
    }
  }

}

