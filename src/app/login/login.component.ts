import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService, User, Login } from './login.service';
import { tap, filter, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('username') usernameInput: ElementRef;
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
      // tap(() => location.reload()),
    ).subscribe();
  }

  onLogin() {
    this.loginService.logIn(this.loginForm.value).subscribe((success) => {
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.snack.open('Nepareiza parole vai lietotājs', 'OK', { duration: 5000 });
        this.loginForm.reset();
        this.usernameInput.nativeElement.focus();
      }
    });
  }

}
