import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { User, UserCreate, UserCreateSchema, UserList, UserListSchema, UserSchema, UserSession, UserSessionSchema, UserUpdate, UserUpdateSchema } from 'src/app/interfaces';
import { ValidatorService } from 'src/app/library';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';
import { DEMO_MODE } from '../app-mode.provider';

type Params = Record<string, any>;

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  readonly #path = getAppParams('apiPath') + 'users/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  private isDemo = inject(DEMO_MODE);

  getOne(name: string): Promise<User> {
    const data$ = this.#http.get(this.#path + name, new HttpOptions().cacheable());
    return this.#validator.validateAsync(UserSchema, data$);
  }

  usersResource(filterSignal: Signal<Record<string, any>>): HttpResourceRef<UserList[]> {
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(filterSignal()).cacheable()), {
      defaultValue: [],
      parse: this.#validator.arrayValidatorFn(UserListSchema),
      equal: isEqual,
    });
  }

  userSessionsResource(username: Signal<string>): HttpResourceRef<UserSession[] | undefined> {
    return httpResource(() => (username() ? httpResponseRequest(this.#path + username() + '/sessions', new HttpOptions().cacheable()) : undefined), {
      parse: this.#validator.arrayValidatorFn(UserSessionSchema),
      equal: isEqual,
    });
  }

  updateOne(id: string | number, data: Partial<User>, params?: Params): Promise<UserUpdate> {
    this.#checkDemoMode();
    const data$ = this.#http.patch(this.#path + id, data, new HttpOptions(params));
    return this.#validator.validateAsync(UserUpdateSchema, data$);
  }

  insertOne(data: Partial<User>, params?: Params): Promise<UserCreate> {
    this.#checkDemoMode();
    return this.#validator.validateAsync(UserCreateSchema, this.#http.put(this.#path, data, new HttpOptions(params)));
  }

  async deleteOne(id: string): Promise<boolean> {
    this.#checkDemoMode();
    const data = await firstValueFrom(this.#http.delete<{ deletedCount: number }>(this.#path + id, new HttpOptions()));
    return data.deletedCount > 0;
  }

  validatorData<K extends keyof User & string>(key: K): Promise<User[K][]> {
    return firstValueFrom(this.#http.get<User[K][]>(this.#path + 'validate/' + key, new HttpOptions().cacheable()));
  }

  uploadToFirestore(id: string): Promise<number> {
    this.#checkDemoMode();
    const data$ = this.#http.post<{ updatedCount: number }>(this.#path + id + '/firestore/upload', new HttpOptions()).pipe(map((data) => data.updatedCount));
    return firstValueFrom(data$);
  }

  passwordUpdate(username: string, password: string): Promise<UserUpdate> {
    this.#checkDemoMode();
    const data$ = this.#http.patch(this.#path + username + '/password', { password });
    return this.#validator.validateAsync(UserUpdateSchema, data$);
  }

  async deleteSessions(username: string, sessionIds: string[]): Promise<number> {
    this.#checkDemoMode();
    const data = await firstValueFrom(this.#http.delete<{ deletedCount: number }>(this.#path + username + '/session', new HttpOptions({ ids: sessionIds })));
    return data.deletedCount;
  }

  #checkDemoMode(): void | never {
    if (this.isDemo) {
      throw new Error('restricted in demo mode');
    }
  }
}
