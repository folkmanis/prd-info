import { HttpService, User, UserPreferences, UserList } from './http.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';


export interface Customer {
  name: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: User[];
  count$ = new Subject<number>();
  users$ = new Subject<User[]>();
  constructor(
    private httpService: HttpService,
  ) { }

  getUsers() {
    this.httpService.getUsersHttp().subscribe(usrs => {
      this.users = usrs.users;
      this.count$.next(usrs.count);
      this.users$.next(usrs.users);
    });
  }

  getUser(username: string): Observable<User> {
    return this.httpService.getUserHttp(username);
  }

  getCustomers(): Observable<Customer[]> {
    return this.httpService.getCustomersHttp().pipe(
      map(customer => customer.map(cust => ({ name: cust || 'Nav norādīts', value: cust })))
    );
  }

  updateUser(username: string, data: Partial<User>): Observable<boolean> {
    return this.httpService.updateUserHttp({ username, ...data }).pipe(
      map(resp => resp.success),
      tap(resp => resp && this.updateUsers(username, data)),
    );
  }

  private updateUsers(username: string, update: Partial<User>): void {
    const idx = this.findUserIdx(username);
    if (idx === -1) { return; } // Ja lietotājs nav sarakstā
    const updUsr = { ...this.users[idx] };
    for (const key of Object.keys(update)) {
      updUsr[key] = update[key];
    }
    this.users[idx] = updUsr;
    this.users$.next(this.users);
  }

  private findUserIdx(username: string) {
    return this.users.findIndex(usr => usr.username === username);
  }

}
