import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { SchemaPath, validateHttp } from '@angular/forms/signals';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import {
  pluckDeletedCount,
  User,
  UserList,
  UserListSchema,
  UserSchema,
  UserSession,
  UserSessionSchema,
  UserUpdate,
  UserUpdateSchema,
} from 'src/app/interfaces';
import { httpFilterSignal, optionalString, validateAsync, validatorFn } from 'src/app/library';
import { cacheable, httpParams, httpResponseRequest } from 'src/app/library/http';
import { NETWORK_ERROR } from 'src/app/library/http/network-error';
import { z } from 'zod';
import { DEMO_MODE } from '../app-mode.provider';

export const UsersFilterSchema = z
  .object({
    name: optionalString,
  })
  .partial();
export type UsersFilter = z.infer<typeof UsersFilterSchema>;

@Service()
export class UsersApiService {
  readonly #path = getAppParams('apiPath') + 'users/';
  #http = inject(HttpClient);

  private isDemo = inject(DEMO_MODE);

  getOne(name: string): Promise<User> {
    const data$ = this.#http.get(this.#path + name, cacheable());
    return validateAsync(UserSchema, data$);
  }

  usersResource(filter: Signal<UsersFilter | undefined>): HttpResourceRef<UserList[]> {
    const query = httpFilterSignal(UsersFilterSchema, filter);
    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      defaultValue: [],
      parse: validatorFn(UserListSchema.array()),
      equal: isEqual,
    });
  }

  userSessionsResource(username: Signal<string>): HttpResourceRef<UserSession[] | undefined> {
    return httpResource(
      () => (username() ? httpResponseRequest(this.#path + username() + '/sessions', cacheable()) : undefined),
      {
        parse: validatorFn(UserSessionSchema.array()),
        equal: isEqual,
      },
    );
  }

  updateOne(id: string | number, data: Partial<User>): Promise<User> {
    this.#checkDemoMode();
    const data$ = this.#http.patch(this.#path + id, data);
    return validateAsync(UserSchema, data$);
  }

  insertOne(data: Partial<User>): Promise<User> {
    this.#checkDemoMode();
    return validateAsync(UserSchema, this.#http.put(this.#path, data));
  }

  deleteOne(id: string): Observable<boolean> {
    this.#checkDemoMode();
    return this.#http.delete<{ deletedCount: number }>(this.#path + id).pipe(pluckDeletedCount(), map(Boolean));
  }

  validate<K extends keyof Pick<User, 'username'>>(schema: SchemaPath<User[K]>, key: K): void {
    validateHttp(schema, {
      request: () => httpResponseRequest(this.#path + 'validate/' + key, cacheable()),
      onSuccess: (response: User[K][], { value }) => {
        const current = value()?.toUpperCase();
        if (response.some((r) => r && r.toUpperCase() === current)) {
          return {
            kind: 'used',
            message: `"${value()}" jau tiek izmantots!`,
          };
        }
      },
      onError: () => NETWORK_ERROR,
    });
  }

  uploadToFirestore(id: string): Promise<number> {
    this.#checkDemoMode();
    const data$ = this.#http
      .post<{ updatedCount: number }>(this.#path + id + '/firestore/upload', {})
      .pipe(map((data) => data.updatedCount));
    return firstValueFrom(data$);
  }

  passwordUpdate(username: string, password: string): Promise<UserUpdate> {
    this.#checkDemoMode();
    const data$ = this.#http.patch(this.#path + username + '/password', { password });
    return validateAsync(UserUpdateSchema, data$);
  }

  async deleteSessions(username: string, sessionIds: string[]): Promise<number> {
    this.#checkDemoMode();
    const data$ = this.#http
      .delete(this.#path + username + '/session', httpParams({ ids: sessionIds }))
      .pipe(pluckDeletedCount());

    return firstValueFrom(data$);
  }

  #checkDemoMode(): void | never {
    if (this.isDemo) {
      throw new Error('restricted in demo mode');
    }
  }
}
