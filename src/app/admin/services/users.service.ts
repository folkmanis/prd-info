import { inject, Injectable } from '@angular/core';
import { User } from 'src/app/interfaces';
import { UsersApiService } from 'src/app/services/prd-api/users-api.service';
import { XmfCustomer } from 'src/app/xmf-search/interfaces';
import { XmfArchiveApiService } from 'src/app/xmf-search/services/xmf-archive-api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private api = inject(UsersApiService);
  private xmfApi = inject(XmfArchiveApiService);

  async getAllUsers() {
    return this.api.getAll();
  }

  async getXmfCustomers(): Promise<XmfCustomer[]> {
    const customer = await this.xmfApi.getXmfCustomer();
    return customer.map((cust) => ({ name: cust || 'Nenoteikts', value: cust }));
  }

  async getUser(username: string): Promise<User> {
    return this.api.getOne(username);
  }

  async updateUser({ username, ...update }: Partial<User>): Promise<User> {
    return this.api.updateOne(username, update);
  }

  async updatePassword(username: string, password: string): Promise<User> {
    return this.api.passwordUpdate(username, password);
  }

  async addUser(data: Partial<User>): Promise<User> {
    return this.api.insertOne(data);
  }

  async deleteUser(username: string): Promise<boolean> {
    return this.api.deleteOne(username);
  }

  async deleteSessions(username: string, sessionIds: string[]): Promise<number> {
    return this.api.deleteSessions(username, sessionIds);
  }

  async uploadToFirestore(username: string) {
    return this.api.uploadToFirestore(username);
  }

  async validateUsername(username: string): Promise<boolean> {
    const existngUsernames = await this.api.validatorData('username');
    return existngUsernames.includes(username) === false;
  }
}
