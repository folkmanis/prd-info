import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { User } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';
import { DEMO_MODE } from '../app-mode.provider';
import { isEqual } from 'lodash-es';

type Params = Record<string, any>;

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  readonly path = getAppParams('apiPath') + 'users/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  private isDemo = inject(DEMO_MODE);

  getOne(name: string): Promise<User> {
    return this.transformer.toInstanceAsync(User, this.http.get(this.path + name, new HttpOptions().cacheable()));
  }

  usersResource(): HttpResourceRef<User[]> {
    return httpResource(httpResponseRequest(this.path, new HttpOptions().cacheable()), {
      defaultValue: [],
      parse: (data: Record<string, any>[]) => this.transformer.plainToInstance(User, data),
      equal: isEqual,
    });
  }

  updateOne(id: string | number, data: Partial<User>, params?: Params): Promise<User> {
    this.checkDemoMode();
    return this.transformer.toInstanceAsync(User, this.http.patch(this.path + id, data, new HttpOptions(params)));
  }

  insertOne(data: Partial<User>, params?: Params): Promise<User> {
    this.checkDemoMode();
    return this.transformer.toInstanceAsync(User, this.http.put(this.path, data, new HttpOptions(params)));
  }

  deleteOne(id: string): Promise<boolean> {
    this.checkDemoMode();
    const data$ = this.http.delete<{ deletedCount: number }>(this.path + id, new HttpOptions()).pipe(map((data) => data.deletedCount > 0));
    return firstValueFrom(data$);
  }

  validatorData<K extends keyof User & string>(key: K): Promise<User[K][]> {
    return firstValueFrom(this.http.get<User[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable()));
  }

  uploadToFirestore(id: string): Promise<number> {
    this.checkDemoMode();
    const data$ = this.http.post<{ updatedCount: number }>(this.path + id + '/firestore/upload', new HttpOptions()).pipe(map((data) => data.updatedCount));
    return firstValueFrom(data$);
  }

  passwordUpdate(username: string, password: string): Promise<User> {
    this.checkDemoMode();
    return this.transformer.toInstanceAsync(User, this.http.patch(this.path + username + '/password', { password }));
  }

  deleteSessions(username: string, sessionIds: string[]): Promise<number> {
    this.checkDemoMode();
    const data$ = this.http.delete<{ deletedCount: number }>(this.path + username + '/session', new HttpOptions({ ids: sessionIds })).pipe(map((data) => data.deletedCount));
    return firstValueFrom(data$);
  }

  private checkDemoMode(): void | never {
    if (this.isDemo) {
      throw new Error('restricted in demo mode');
    }
  }
}
