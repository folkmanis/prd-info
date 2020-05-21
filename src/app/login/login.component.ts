import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as loginActions from 'src/app/actions/login.actions';
import { StoreState, Login } from 'src/app/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private store: Store<StoreState>,
  ) { }

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl(),
  });

  ngOnInit() {
    this.store.dispatch(loginActions.logout());
  }

  onLogin() {
    const credentials: Login = this.loginForm.value;
    this.loginForm.reset();
    this.store.dispatch(loginActions.login(credentials));
  }

}
