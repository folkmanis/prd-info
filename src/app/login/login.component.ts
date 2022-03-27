import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { LoginService } from './services/login.service';
import { FocusedDirective } from 'src/app/library/directives/focused.directive';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

  @ViewChild(FocusedDirective) username: FocusedDirective;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl(),
  });


  constructor(
    private router: Router,
    private snack: MatSnackBar,
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    this.loginService.isLogin().pipe(
      filter(login => login),
      switchMap(_ => this.loginService.logOut()),
    ).subscribe();
  }

  onLogin() {
    this.loginService.logIn(this.loginForm.value)
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/']);
        } else {
          this.snack.open('Nepareiza parole vai lietotājs', 'OK', { duration: 5000 });
          this.loginForm.reset();
          this.username.focus();
        }
      });
  }

}
