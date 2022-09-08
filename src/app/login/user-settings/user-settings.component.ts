import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { isEqual } from 'lodash-es';
import { DestroyService } from 'prd-cdk';
import { takeUntil } from 'rxjs';
import { User } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { LoginService } from '../services/login.service';

type UserUpdate = Pick<User, 'name' | 'eMail'>;

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class UserSettingsComponent implements OnInit, CanComponentDeactivate {

  userForm = new FormGroup({
    name: new FormControl(
      '',
      [Validators.required]
    ),
    eMail: new FormControl(
      '',
      [Validators.email]
    )
  });


  user$ = this.loginService.user$;

  initialUser: UserUpdate;

  returnPath = this.route.snapshot.url.join('%2F');

  canDeactivate = () => !this.isChanged;

  private snack = (msg: string) => this.snackService.open(msg, 'OK', { duration: 3000 });


  constructor(
    private loginService: LoginService,
    private snackService: MatSnackBar,
    private route: ActivatedRoute,
    private destroy$: DestroyService,
  ) { }

  get isChanged(): boolean {
    return !isEqual(this.userForm.value, this.initialUser);
  }

  ngOnInit(): void {

    this.user$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(user => {
      this.initialUser = {
        name: user.name,
        eMail: user.eMail,
      };
      this.onSetInitial();
    });

  }

  onSave(userFormValue: UserUpdate) {
    this.loginService.updateUser(userFormValue)
      .subscribe({
        next: () => this.snack('Dati saglabāti'),
        error: () => this.snack('Neizdevās saglabāt'),
      });
  }

  onSetInitial() {
    this.userForm.setValue(this.initialUser);
    this.userForm.markAsPristine();
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

  onGoogleValueClicked([key, value]: [string, string]) {
    switch (key) {
      case 'name':
        this.userForm.patchValue({ name: value });
        break;

      case 'email':
        this.userForm.patchValue({ eMail: value });
        break;

      default:
        return;
    }
    this.userForm.markAsDirty();
  }


}
