import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { FocusedDirective } from 'src/app/library/directives/focused.directive';
import { DEMO_MODE } from '../services/app-mode.provider';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FocusedDirective,
  ],
})
export class LoginComponent implements OnInit {

  @ViewChild(FocusedDirective) username: FocusedDirective;

  loginForm = new FormGroup({
    username: new FormControl('',
      {
        validators: [Validators.required],
        nonNullable: true,
      }),
    password: new FormControl('', { nonNullable: true }),
  });

  isDemo = inject(DEMO_MODE);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    this.loginService.isLogin().pipe(
      filter(login => login),
      switchMap(_ => this.loginService.logOut()),
    ).subscribe();

    const err = this.route.snapshot.queryParamMap.get('error');
    if (typeof err === 'string') {
      this.snack.open(`Kļūda '${err}'`, 'OK', { duration: 5000 });
    }
  }

  onLogin() {
    this.loginService.logIn(this.loginForm.getRawValue())
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.snack.open('Nepareiza parole vai lietotājs', 'OK', { duration: 5000 });
          this.loginForm.controls.password.reset();
          this.username.focus();
        }
      });
  }

}
