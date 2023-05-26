import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { FocusedDirective } from 'src/app/library/directives/focused.directive';
import { LoginService } from './services/login.service';
import { CommonModule } from '@angular/common';
import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { DEMO_MODE } from '../services/app-mode.provider';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, LibraryModule, MaterialLibraryModule],
})
export class LoginComponent implements OnInit {

  @ViewChild(FocusedDirective) username: FocusedDirective;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>(''),
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
    this.loginService.logIn(this.loginForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.snack.open('Nepareiza parole vai lietotājs', 'OK', { duration: 5000 });
          this.loginForm.reset();
          this.username.focus();
        }
      });
  }

}
