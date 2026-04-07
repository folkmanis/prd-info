import { A11yModule } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  InputSignal,
  model,
  ModelSignal,
  Signal,
  signal,
  viewChild,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

export class SignalErrorStateMatcher implements ErrorStateMatcher {
  constructor(private isError: Signal<boolean>) {}

  isErrorState(): boolean {
    return this.isError();
  }
}

@Component({
  selector: 'app-password-input-group',
  templateUrl: './password-input-group.component.html',
  styleUrls: ['./password-input-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [A11yModule, MatFormFieldModule, MatIcon, MatIconButton, MatInput],
})
export class PasswordInputGroupComponent implements FormValueControl<string> {
  protected confirmationMatInput = viewChild<MatInput>('confirmationMatInput');
  protected passwordMatInput = viewChild<MatInput>('passwordMatInput');

  protected password = signal('');
  protected confirmation = signal('');

  protected hide = true;

  value: ModelSignal<string> = model('');

  touched = model(false);

  minLength: InputSignal<number | undefined> = input();

  errors = input([] as readonly ValidationError[]);
  #passwordError = computed(() => this.errors().length > 0);
  protected passwordErrorMatcher = new SignalErrorStateMatcher(this.#passwordError);

  disabled = input(false);

  required = input(false);

  hidden = input(false);

  protected confirmationError = signal(false);
  protected confirmationErrorMatcher = new SignalErrorStateMatcher(this.confirmationError);

  constructor() {
    effect(() => {
      this.#passwordError();
      this.passwordMatInput()?.updateErrorState();
    });
    effect(() => {
      this.confirmationError();
      this.confirmationMatInput()?.updateErrorState();
    });
  }

  protected onPasswordInput(value: string) {
    this.password.set(value);
    this.confirmationError.set(false);
    this.#updateValue();
  }

  protected onConfirmationInput(value: string) {
    this.confirmation.set(value);
    this.#updateValue();
    if (this.password() === this.confirmation()) {
      this.confirmationError.set(false);
    }
  }

  protected onPasswordBlur() {
    if (this.confirmation()) {
      this.confirmationError.set(this.password() !== this.confirmation());
    }
  }

  protected onConfirmationBlur() {
    this.confirmationError.set(this.password() !== this.confirmation());
  }

  #updateValue() {
    const password = this.password();
    const confirmation = this.confirmation();

    const value = password === confirmation ? password : '';
    this.value.set(value);
  }
}
