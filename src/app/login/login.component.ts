import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService, User, Login } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,
  ) { }

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(),
    pass: new FormControl(),
  });

  ngOnInit() {
  }

  onLogin() {

  }

}
