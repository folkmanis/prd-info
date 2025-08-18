import { inject, Injectable } from '@angular/core';
import { User } from 'src/app/interfaces';
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

  updateUser({ username, ...update }: Partial<User> & Pick<User, 'username'>): Promise<User> {
    return this.api.updateOne(username, update);
  }

  updatePassword(username: string, password: string): Promise<User> {
    return this.api.passwordUpdate(username, password);
  }

  addUser(data: Partial<User>): Promise<User> {
    return this.api.insertOne(data);
  }

  deleteUser(username: string): Promise<boolean> {
    return this.api.deleteOne(username);
  }

  deleteSessions(username: string, sessionIds: string[]): Promise<number> {
    return this.api.deleteSessions(username, sessionIds);
  }

  uploadToFirestore(username: string) {
    return this.api.uploadToFirestore(username);
  }

  async validateUsername(username: string): Promise<boolean> {
    const existngUsernames = await this.api.validatorData('username');
    return existngUsernames.includes(username) === false;
  }
}
