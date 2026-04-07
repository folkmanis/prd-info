import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import { disabled, email, form, FormField, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatOption, MatSelect } from '@angular/material/select';
import { pick } from 'lodash-es';
import { getAppParams } from 'src/app/app-params';
import { User, UserCreate, UserUpdate } from 'src/app/interfaces';
import { stringOrThrow } from 'src/app/library';
import { ConfirmationDirective } from 'src/app/library/confirmation-dialog';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { PasswordInputDirective } from 'src/app/library/password-input';
import { PasswordInputGroupComponent } from 'src/app/library/password-input/password-input-group/password-input-group.component';
import { computedSignalChanges } from 'src/app/library/signals';
import { SimpleContentContainerComponent } from 'src/app/library/simple-form/simple-content-container/simple-content-container.component';
import { updateCatching } from 'src/app/library/update-catching';
import { LoginService } from 'src/app/login';
import { UsersListComponent } from '../users-list/users-list.component';
import { UsersService } from '../users.service';
import { SessionsComponent } from './sessions/sessions.component';

interface UserModel {
  username: string;
  name: string;
  password: string;
  userDisabled: boolean;
  eMail: string;
  prefersDarkMode: boolean;
  preferencesCustomers: string[];
  preferencesModules: string[];
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    SessionsComponent,
    PasswordInputDirective,
    SimpleContentContainerComponent,
    PasswordInputGroupComponent,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    MatCardModule,
    MatButtonModule,
    MatInput,
    MatCheckbox,
    MatProgressSpinner,
    AsyncPipe,
    ConfirmationDirective,
  ],
})
export class UserEditComponent implements CanComponentDeactivate {
  #usersList = inject(UsersListComponent);
  #navigate = navigateRelative();

  #usersService = inject(UsersService);

  protected busy = signal(false);
  #update = updateCatching(this.busy);

  user = input.required<User>();
  protected initialValue = linkedSignal(() => this.user());
  #initialModel = computed(() => this.#toModel(this.initialValue()));

  #username = computed(() => this.initialValue().username);
  protected isNew = computed(() => !this.#username());

  protected customers = this.#usersService.getXmfCustomers();
  protected userModules = getAppParams('userModules');
  protected sessions = this.#usersService.getUserSessionsResource(this.#username);
  protected currentSessionId = inject(LoginService).getSessionId();

  #userModel = linkedSignal(() => this.#initialModel());
  protected userForm = form(this.#userModel, (s) => {
    required(s.name);

    disabled(s.username, () => !this.isNew());
    required(s.username);
    minLength(s.username, 3, { message: `Jāsatur vismaz 3 zīmes` });
    maxLength(s.username, 12, { message: `Ne vairāk kā 12 zīmes` });
    pattern(s.username, /^[A-Za-z0-9_]+$/, { message: `Atļauti tikai burti un skaitļi` });
    this.#usersService.validateHttpUsername(s.username);

    disabled(s.password, () => !this.isNew());
    minLength(s.password, 3, { message: `Parolei jāsatur vismaz 3 zīmes` });
    required(s.password);

    email(s.eMail, { message: `Neatbilst e-pasta formātam` });

    disabled(s, () => this.busy());
  });

  protected changes = computedSignalChanges(this.#userModel, this.#initialModel);

  constructor() {
    effect(() => {
      this.initialValue();
      untracked(() => {
        this.userForm().reset();
      });
    });
  }

  canDeactivate(): boolean {
    return this.userForm().touched() === false || this.changes() === null;
  }

  protected onReset() {
    this.#userModel.set(this.#toModel(this.initialValue()));
    this.userForm().reset();
  }

  protected async onSave() {
    const username = this.initialValue().username;
    if (username) {
      this.#updateUser(username);
    } else {
      this.#createUser();
    }
  }

  #createUser() {
    this.#update(async (message) => {
      const { username } = await this.#usersService.addUser(this.#toUserCreate(this.#userModel()));
      message(`Lietotājs ${username} izveidots`);
      this.#usersList.onReload();
      this.userForm().reset();
      this.#navigate(['..', username]);
    });
  }

  #updateUser(username: string) {
    this.#update(async (message) => {
      const changes = this.changes();
      if (!changes) {
        return;
      }
      const updated = await this.#usersService.updateUser(username, this.#toUserUpdate(changes));
      message(`Lietotājs saglabāts!`);
      this.initialValue.set(updated);
    });
  }

  protected async onPasswordChange(password: string) {
    if (this.userForm().dirty()) {
      return;
    }
    this.#update(
      async (message) => {
        const username = stringOrThrow(this.#username());
        const user = await this.#usersService.updatePassword(username, password);
        this.initialValue.set(user);
        message(`Lietotāja ${username} parole nomainita!`);
      },
      (message) => {
        message(`Paroli nomainīt neizdevās`);
      },
    );
  }

  protected async onDeleteUser() {
    if (this.userForm().dirty()) {
      return;
    }
    this.#update(
      async (message) => {
        const username = stringOrThrow(this.#username());
        await this.#usersService.deleteUser(username);
        message(`Lietotājs izdzēsts`);
        this.#usersList.onReload();
        this.userForm().reset();
        this.#navigate(['..']);
      },
      (message) => message(`Neizdevās izdzēst`),
    );
  }

  protected async onDeleteSessions(sessionIds: string[]) {
    if (this.userForm().dirty()) {
      return;
    }
    this.#update(
      async (message) => {
        const username = stringOrThrow(this.#username());
        const deletedSessionsCount = await this.#usersService.deleteSessions(username, sessionIds);
        this.sessions.reload();
        message(`Deleted ${deletedSessionsCount} sessions`);
      },
      (message) => message(`Neizdevās izdzēst`),
    );
  }

  protected async onUploadToFirestore() {
    this.#update(
      async (message) => {
        const username = stringOrThrow(this.#username());
        await this.#usersService.uploadToFirestore(username);
        message('Dati saglabāti lietotnē');
      },
      (message, err) => message(`Neizdevās saglabāt. Kļūda ${err.message}`),
    );
  }

  #toModel(user: User): UserModel {
    return {
      username: user.username,
      name: user.name,
      password: '',
      userDisabled: user.userDisabled,
      eMail: user.eMail ?? '',
      prefersDarkMode: user.prefersDarkMode,
      preferencesCustomers: user.preferences.customers,
      preferencesModules: user.preferences.modules,
    };
  }

  #toUserCreate(model: UserModel): UserCreate {
    return {
      username: model.username,
      name: model.name,
      admin: false,
      userDisabled: model.userDisabled,
      eMail: model.eMail,
      preferences: {
        customers: model.preferencesCustomers,
        modules: model.preferencesModules,
      },
      google: null,
      prefersDarkMode: model.prefersDarkMode,
      password: model.password,
    };
  }

  #toUserUpdate(model: Partial<UserModel>): UserUpdate {
    const update = pick(model, 'username', 'name', 'admin', 'eMail', 'prefersDarkMode') as UserUpdate;
    if (model.preferencesCustomers) {
      update['preferences.customers'] = model.preferencesCustomers;
    }
    if (model.preferencesModules) {
      update['preferences.modules'] = model.preferencesModules;
    }
    return update;
  }
}
