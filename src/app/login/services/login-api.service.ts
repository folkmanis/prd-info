import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { LoginUser, LoginUserSchema, LoginUserUpdate } from 'src/app/interfaces';
import { validateAsync, validatorFn } from 'src/app/library';
import { DEMO_MODE } from 'src/app/services/app-mode.provider';
import { z } from 'zod';
import { Login } from '../login.interface';

@Service()
export class LoginApiService {
  readonly #path = getAppParams('apiPath') + 'login/';
  #http = inject(HttpClient);

  #isDemo = inject(DEMO_MODE, { optional: true });

  async login(login: Login): Promise<LoginUser> {
    return validateAsync(LoginUserSchema, this.#http.post(this.#path, login));
  }

  async logout(): Promise<void> {
    await firstValueFrom(this.#http.delete(this.#path));
  }

  async getLogin(): Promise<LoginUser> {
    return validateAsync(LoginUserSchema, this.#http.get(this.#path));
  }

  getSessionToken(): Observable<string> {
    return this.#http.get(this.#path + 'session-token').pipe(
      map(validatorFn(z.object({ data: z.string() }))),
      map((value) => value.data),
    );
  }

  async getSessionId(): Promise<string> {
    const data$ = this.#http.get(this.#path + 'session-id');
    const { sessionId } = await validateAsync(z.object({ sessionId: z.string() }), data$);
    return sessionId;
  }

  async patchUser(update: LoginUserUpdate): Promise<LoginUser> {
    this.#checkDemoMode();
    return validateAsync(LoginUserSchema, this.#http.patch(this.#path, update));
  }

  #checkDemoMode(): void | never {
    if (this.#isDemo) {
      throw new Error('restricted in demo mode');
    }
  }
}
