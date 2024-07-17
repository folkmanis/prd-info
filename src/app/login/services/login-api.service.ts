import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { User } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';
import { Login } from '../login.interface';
import { DEMO_MODE } from 'src/app/services/app-mode.provider';

@Injectable({
  providedIn: 'root',
})
export class LoginApiService {
  private path = getAppParams('apiPath') + 'login/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  private isDemo = inject(DEMO_MODE);

  async login(login: Login): Promise<User> {
    return this.transformer.toInstanceAsync(User, this.http.post<Record<string, any>>(this.path, login));
  }

  async logout(): Promise<unknown> {
    return firstValueFrom(this.http.delete(this.path));
  }

  async getLogin(): Promise<User> {
    return this.transformer.toInstanceAsync(User, this.http.get<Record<string, any>>(this.path));
  }

  getSessionToken(): Observable<string> {
    return this.http.get<{ data: string }>(this.path + 'session-token').pipe(map((value) => value.data));
  }

  getSessionId(): Observable<string> {
    return this.http.get<{ sessionId: string }>(this.path + 'session-id').pipe(map((data) => data.sessionId));
  }

  async patchUser({ username, ...update }: Partial<User>): Promise<User> {
    this.checkDemoMode();
    return this.transformer.toInstanceAsync(User, this.http.patch<Record<string, any>>(this.path, update, new HttpOptions()));
  }

  private checkDemoMode(): void | never {
    if (this.isDemo) {
      throw new Error('restricted in demo mode');
    }
  }
}
