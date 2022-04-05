import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/interfaces';
import { LoginService } from '../services/login.service';
import { Observable, Subscription } from 'rxjs';
import { isEqual } from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';

type UserUpdate = Pick<User, 'name'>;

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  userForm: FormGroup;

  user$ = this.loginService.user$;

  initialUser: UserUpdate;

  returnPath = this.route.snapshot.url.join('%2F');

  canDeactivate: () => boolean | Observable<boolean> | Promise<boolean> = () => this.userForm.pristine;

  private subs: Subscription;

  private snack = (msg: string) => this.snackService.open(msg, 'OK', { duration: 3000 });


  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private snackService: MatSnackBar,
    private route: ActivatedRoute,
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

  onDeleteGoogle() {
    this.loginService.updateUser({ google: null }).subscribe();
  }

  isChanged(update: UserUpdate): boolean {
    return !isEqual(update, this.initialUser);
  }

}
