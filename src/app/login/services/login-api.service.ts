import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { LoginUser, LoginUserSchema, LoginUserUpdate } from 'src/app/interfaces';
import { ValidatorService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';
import { DEMO_MODE } from 'src/app/services/app-mode.provider';
import { Login } from '../login.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginApiService {
  readonly #path = getAppParams('apiPath') + 'login/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  #isDemo = inject(DEMO_MODE);

  async login(login: Login): Promise<LoginUser> {
    return this.#validator.validateAsync(LoginUserSchema, this.#http.post<Record<string, any>>(this.#path, login));
  }

  async logout(): Promise<unknown> {
    return firstValueFrom(this.#http.delete(this.#path));
  }

  async getLogin(): Promise<LoginUser> {
    return this.#validator.validateAsync(LoginUserSchema, this.#http.get<Record<string, any>>(this.#path));
  }

  getSessionToken(): Observable<string> {
    return this.#http.get<{ data: string }>(this.#path + 'session-token').pipe(map((value) => value.data));
  }

  async getSessionId(): Promise<string> {
    const { sessionId } = await firstValueFrom(this.#http.get<{ sessionId: string }>(this.#path + 'session-id'));
    return sessionId;
  }

  async patchUser(update: LoginUserUpdate): Promise<LoginUser> {
    this.checkDemoMode();
    return this.#validator.validateAsync(LoginUserSchema, this.#http.patch<Record<string, any>>(this.#path, update, new HttpOptions()));
  }

  private checkDemoMode(): void | never {
    if (this.#isDemo) {
      throw new Error('restricted in demo mode');
    }
  }
}
