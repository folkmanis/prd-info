import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { filter, switchMap, take } from 'rxjs/operators';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('username', { read: MatInput }) usernameInput: MatInput;
  constructor(
    private router: Router,
    private snack: MatSnackBar,
    private loginService: LoginService,
  ) { }

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl(),
  });

  ngOnInit() {
    this.loginService.isLogin$.pipe(
      take(1),
      filter(login => login),
      switchMap(() => this.loginService.logOut()),
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.usernameInput.focus();
  }

  onLogin() {
    this.loginService.logIn(this.loginForm.value).subscribe((success) => {
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.snack.open('Nepareiza parole vai lietotājs', 'OK', { duration: 5000 });
        this.loginForm.reset();
        this.usernameInput.focus();
      }
    });
  }

}
