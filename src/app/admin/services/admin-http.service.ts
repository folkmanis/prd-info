import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces';

export interface UserList {
  count: number;
  users: User[];
}

@Injectable()
export class AdminHttpService {
  private httpPathSearch = '/data/xmf-search/';

  constructor(
    private http: HttpClient,
  ) { }

  getCustomersHttp(): Observable<string[]> {
    return this.http.get<string[]>(this.httpPathSearch + 'customers');
  }

}
