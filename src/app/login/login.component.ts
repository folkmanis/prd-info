import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FocusedDirective,
  ],
})
export class LoginComponent {

  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private loginService = inject(LoginService);

  private usernameInput = viewChild.required(FocusedDirective);

  username = model('');
  password = model('');

  isDemo = inject(DEMO_MODE);

  error = input<string>();

  busy = signal(true);

  constructor() {
    this.checkLogout();
    effect(() => {
      if (this.error()) {
        this.snack.open(`Kļūda '${this.error()}'`, 'OK');
      }
    });
  }

  async onLogin() {

    this.busy.set(true);

    const loginData = {
      username: this.username(),
      password: this.password(),
    };

    try {
      await this.loginService.logIn(loginData);
      this.router.navigateByUrl('/');
    } catch (error) {
      this.snack.open('Nepareiza parole vai lietotājs', 'OK', { duration: 5000 });
      this.password.set('');
      this.usernameInput().focus();
    }

    this.busy.set(false);

  }

  private async checkLogout() {
    const isLoggedIn = await this.loginService.isLoggedIn();
    if (isLoggedIn) {
      await this.loginService.logOut();
    }
    this.busy.set(false);
  }
}
