import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interfaces';
import { UsersApiService } from 'src/app/services/prd-api/users-api.service';
import { XmfCustomer } from 'src/app/xmf-search/interfaces';
import { XmfArchiveApiService } from 'src/app/xmf-search/services/xmf-archive-api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  constructor(
    private api: UsersApiService,
    private xmfApi: XmfArchiveApiService
  ) { }

  async getAllUsers() {
    return firstValueFrom(this.api.getAll());
  }

  getXmfCustomers(): Observable<XmfCustomer[]> {
    return this.xmfApi
      .getXmfCustomer()
      .pipe(
        map((customer) =>
          customer.map((cust) => ({ name: cust || 'Nenoteikts', value: cust }))
        )
      );
  }

  async getUser(username: string): Promise<User> {
    return firstValueFrom(this.api.getOne(username));
  }

  async updateUser({ username, ...update }: Partial<User>): Promise<User> {
    return firstValueFrom(this.api.updateOne(username, update));
  }

  async updatePassword(username: string, password: string): Promise<User> {
    return firstValueFrom(this.api.passwordUpdate(username, password));
  }

  async addUser(data: Partial<User>): Promise<User> {
    return firstValueFrom(this.api.insertOne(data));
  }

  async deleteUser(username: string): Promise<boolean> {
    return firstValueFrom(this.api.deleteOne(username));
  }

  async deleteSessions(username: string, sessionIds: string[]): Promise<number> {
    return firstValueFrom(this.api.deleteSessions(username, sessionIds));
  }

  async uploadToFirestore(username: string) {
    return firstValueFrom(this.api.uploadToFirestore(username));
  }

  validateUsername(username: string): Observable<boolean> {
    return this.api
      .validatorData('username')
      .pipe(map((names) => !names.includes(username)));
  }
}
