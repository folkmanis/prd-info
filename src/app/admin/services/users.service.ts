import { HttpService, User, UserPreferences, UserList } from './http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private httpService: HttpService,
  ) { }

  getUsers(): Observable<UserList> {
    return this.httpService.getUsersHttp();
  }
}
