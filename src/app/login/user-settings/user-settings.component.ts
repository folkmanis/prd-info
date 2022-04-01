import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/interfaces';
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs';
import { isEqual } from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';

type UserUpdate = Pick<User, 'name'>;

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  userForm: FormGroup;

  user$ = this.loginService.user$;

  initialUser: UserUpdate;

  private subs: Subscription;

  private snack = (msg: string) => this.snackService.open(msg, 'OK', { duration: 3000 });

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private snackService: MatSnackBar,
  ) { }

  ngOnInit(): void {

    this.userForm = this.fb.group({
      name: [
        undefined,
        [Validators.required]
      ]
    });

    this.subs = this.user$.subscribe(user => {
      this.initialUser = {
        name: user.name
      };
      this.onSetInitial();
    });

  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSave(userFormValue: UserUpdate) {
    this.userForm.disable();
    this.loginService.updateUser(userFormValue).subscribe();
  }

  onSetInitial() {
    this.userForm.setValue(this.initialUser);
    this.userForm.markAsPristine();
    this.userForm.enable();
  }

  onPasswordChange(password: string) {
    this.loginService.updateUser({ password }).subscribe({
      next: () => this.snack('Parole nomainīta!'),
      error: () => this.snack('Neizdevās nomainīt paroli!'),
    });
  }

  isChanged(update: UserUpdate): boolean {
    return !isEqual(update, this.initialUser);
  }

}
