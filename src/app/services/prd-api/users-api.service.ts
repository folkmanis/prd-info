import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { User } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';
import { DEMO_MODE } from '../app-mode.provider';

type Params = Record<string, any>;

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  readonly path = getAppParams('apiPath') + 'users/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  private isDemo = inject(DEMO_MODE);

  async getOne(name: string): Promise<User> {
    return this.transformer.toInstanceAsync(User, this.http.get(this.path + name, new HttpOptions().cacheable()));
  }

  async getAll(): Promise<User[]> {
    return this.transformer.toInstanceAsync(User, this.http.get<Record<string, any>[]>(this.path, new HttpOptions().cacheable()));
  }

  async updateOne(id: string | number, data: Partial<User>, params?: Params): Promise<User> {
    this.checkDemoMode();
    return this.transformer.toInstanceAsync(User, this.http.patch(this.path + id, data, new HttpOptions(params)));
  }

  async insertOne(data: Partial<User>, params?: Params): Promise<User> {
    this.checkDemoMode();
    return this.transformer.toInstanceAsync(User, this.http.put(this.path, data, new HttpOptions(params)));
  }

  async deleteOne(id: string): Promise<boolean> {
    this.checkDemoMode();
    const { deletedCount } = await firstValueFrom(this.http.delete<{ deletedCount: number }>(this.path + id, new HttpOptions()));
    return deletedCount > 0;
  }

  async validatorData<K extends keyof User & string>(key: K): Promise<User[K][]> {
    return firstValueFrom(this.http.get<User[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable()));
  }

  async uploadToFirestore(id: string): Promise<number> {
    this.checkDemoMode();
    const { updatedCount } = await firstValueFrom(this.http.post<{ updatedCount: number }>(this.path + id + '/firestore/upload', new HttpOptions()));
    return updatedCount;
  }

  async passwordUpdate(username: string, password: string): Promise<User> {
    this.checkDemoMode();
    return this.transformer.toInstanceAsync(User, this.http.patch(this.path + username + '/password', { password }));
  }

  async deleteSessions(username: string, sessionIds: string[]): Promise<number> {
    this.checkDemoMode();
    const { deletedCount } = await firstValueFrom(this.http.delete<{ deletedCount: number }>(this.path + username + '/session', new HttpOptions({ ids: sessionIds })));
    return deletedCount;
  }

  private checkDemoMode(): void | never {
    if (this.isDemo) {
      throw new Error('restricted in demo mode');
    }
  }
}
