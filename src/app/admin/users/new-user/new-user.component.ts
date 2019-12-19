import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators, ValidationErrors, AsyncValidator, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { UsersService, Customer } from '../../services/users.service';
import { User } from '../../services/http.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  newUserForm = new FormGroup({
    username: new FormControl(null, [Validators.required, this.usernamePatternValidator, Validators.minLength(4)], [this.existingUsernameValidator()]),
    password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    name: new FormControl(null, Validators.required),
    admin: new FormControl(false),
    preferences: new FormGroup({
      customers: new FormControl(),
    }),
  });
  username = this.newUserForm.get('username');
  password = this.newUserForm.get('password');
  name = this.newUserForm.get('name');

  customers: Customer[];
  constructor(
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.usersService.getCustomers().subscribe((cust) => this.customers = cust);
  }

  onSave() {
    const username = this.username.value;
    this.usersService.addUser(this.newUserForm.value).subscribe(resp => {
      if (resp) {
        this.snackBar.open(`Lietotājs ${username} izveidots!`, 'OK', { duration: 3000 });
        this.router.navigate(['admin', 'users', { id: username }]);
      } else {
        this.snackBar.open(`Neizdevās izveidot lietotāju`, 'OK', { duration: 5000 });
      }
    });
  }

  private existingUsernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any; } | null> => {
      return this.usersService.validateUsername(control.value).pipe(
        map(valid => valid ? null : { existing: 'Esošs lietotājvārds' })
      );
    };
  }

  private usernamePatternValidator(control: AbstractControl): ValidationErrors {
    const val: string = control.value || '';
    if (val.match(/ /)) {
      return { symbol: 'Atstarpi nedrīkst izmantot' };
    }
    return null;
  }

}

