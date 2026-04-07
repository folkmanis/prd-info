import { inject, Injectable, Signal } from '@angular/core';
import { SchemaPath } from '@angular/forms/signals';
import { User, UserUpdate } from 'src/app/interfaces';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { UsersApiService } from 'src/app/services/prd-api/users-api.service';
import { XmfCustomer } from 'src/app/xmf-search/interfaces';
import { XmfArchiveApiService } from 'src/app/xmf-search/services/xmf-archive-api.service';

export type UsersFilter = {
  name?: string;
};

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private api = inject(UsersApiService);
  private xmfApi = inject(XmfArchiveApiService);

  getUsersResource(filterSignal?: FilterInput<UsersFilter>) {
    return this.api.usersResource(toFilterSignal(filterSignal));
  }

  async getXmfCustomers(): Promise<XmfCustomer[]> {
    const customers = await this.xmfApi.getXmfCustomers();
    return customers.map((cust) => ({ name: cust || 'Nenoteikts', value: cust }));
  }

  getUser(username: string): Promise<User> {
    return this.api.getOne(username);
  }

  async updateUser(username: string, update: UserUpdate): Promise<User> {
    await this.api.updateOne(username, update);
    return this.getUser(username);
  }

  async updatePassword(username: string, password: string): Promise<User> {
    await this.api.passwordUpdate(username, password);
    return this.getUser(username);
  }

  async addUser(data: Partial<User>): Promise<User> {
    const user = await this.api.insertOne(data);
    return this.getUser(user.username);
  }

  deleteUser(username: string): Promise<boolean> {
    return this.api.deleteOne(username);
  }

  getUserSessionsResource(username: Signal<string>) {
    return this.api.userSessionsResource(username);
  }

  deleteSessions(username: string, sessionIds: string[]): Promise<number> {
    return this.api.deleteSessions(username, sessionIds);
  }

  uploadToFirestore(username: string) {
    return this.api.uploadToFirestore(username);
  }

  validateHttpUsername(schema: SchemaPath<string>): void {
    this.api.validate(schema, 'username');
  }
}
