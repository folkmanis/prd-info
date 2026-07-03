import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { isEqual, pick, pickBy } from 'lodash-es';
import { LoginUser, User } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { LoginService } from 'src/app/login';
import { PasswordInputDirective } from '../library/password-input';
import { DEMO_MODE } from '../services/app-mode.provider';
import { GoogleInfoComponent } from './google-info/google-info.component';
import { computedChanges } from '../library/signals';
import { email, form, FormField, required } from '@angular/forms/signals';
import { updateCatching } from '../library/update-catching';

type UserModel = { name: string; eMail: string };

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  imports: [
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInput,
    GoogleInfoComponent,
    MatDivider,
    MatButton,
    PasswordInputDirective,
  ],
})
export class UserSettingsComponent implements CanComponentDeactivate {
  private loginService = inject(LoginService);

  protected busy = signal(false);
  #update = updateCatching(this.busy);

  user = this.loginService.user;

  #initialModel = computed(() => this.#toModel(this.user()));

  #userModel = linkedSignal(() => this.#initialModel());

  form = form(this.#userModel, (schema) => {
    required(schema.name);
    email(schema.eMail);
  });

  #toModel(user?: Pick<User, 'name' | 'eMail'> | null): UserModel {
    return {
      name: user?.name ?? '',
      eMail: user?.eMail ?? '',
    };
  }
  #fromModel(model: UserModel) {
    return {
      name: model.name || undefined,
      email: model.eMail || undefined,
    };
  }

  isDemo = inject(DEMO_MODE);

  changes = computed(() => computedChanges(this.#userModel(), this.#initialModel()));

  returnPath = inject(ActivatedRoute).snapshot.url.join('%2F');

  canDeactivate = () => !this.changes() || this.form().dirty() === false;

  constructor() {
    effect(() => {
      this.user();
      untracked(() => this.form().reset());
    });
  }

  async onSave() {
    if (!this.changes()) {
      return;
    }
    this.#update(async (message) => {
      await this.loginService.updateUser(this.#fromModel(this.#userModel()));
      message('Dati saglabāti');
    });
  }

  onReset() {
    this.form().reset(this.#initialModel());
  }

  async onPasswordChange(password: string) {
    this.#update(async (message) => {
      await this.loginService.updateUser({ password });
      message('Parole nomainīta!');
    });
  }

  async onDeleteGoogle() {
    this.#update(async (message) => {
      await this.loginService.updateUser({ google: null });
      message('Google savienojums dzēsts');
    });
  }

  onGoogleValueClicked<K extends keyof UserModel>([key, value]: [K, UserModel[K]]) {
    this.#userModel.update((user) => ({
      ...user,
      [key]: value,
    }));
  }
}
