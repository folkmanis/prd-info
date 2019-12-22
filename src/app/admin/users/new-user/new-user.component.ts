import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators, ValidationErrors, AsyncValidator, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { UsersService, Customer } from '../../services/users.service';
import { User } from '../../services/http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Validator } from '../../services/validator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../../../library/confirmation-dialog/confirmation-dialog.component";
import { CanComponentDeactivate } from "../../../library/guards/can-deactivate.guard";

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
    }),
  });
  username = this.newUserForm.get('username');
  password = this.newUserForm.get('password');
  name = this.newUserForm.get('name');
  hide = true; // Paroles ievades laukam

  customers: Customer[];
  constructor(
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.usersService.getCustomers().subscribe((cust) => this.customers = cust);
  }

  onSave() {
    const username = this.username.value;
    this.usersService.addUser(this.newUserForm.value).subscribe(resp => {
      if (resp) {
        this.newUserForm.markAsPristine();
        this.snackBar.open(`Lietotājs ${username} izveidots!`, 'OK', { duration: 3000 });
        this.router.navigate(['admin', 'users', { id: username }]);
      } else {
        this.snackBar.open(`Neizdevās izveidot lietotāju`, 'OK', { duration: 5000 });
      }
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.newUserForm.pristine) {
      return true;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        prompt: 'Vai tiešām vēlaties pamest nesaglabātu?',
        yes: 'Jā, pamest!',
        no: 'Nē, turpināt!',
      }
    })
    return dialogRef.afterClosed();
  }

}

