import { HttpService, User, UserPreferences, UserList } from './http.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { map, tap, filter, switchMap } from 'rxjs/operators';


export interface Customer {
  name: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: User[]; // Statiskais lietotāju saraksts
  count$ = new Subject<number>();
  users$ = new Subject<User[]>();
  constructor(
    private httpService: HttpService,
  ) { }
  /**
   * Saņem lietotāju sarakstu no REST
   */
  getUsers() {
    this.httpService.getUsersHttp().subscribe(usrs => {
      this.users = usrs.users;
      this.count$.next(usrs.count);
      this.users$.next(usrs.users);
    });
  }
  /**
   * Saņem lietotāja ierakstu no REST
   * @param username Lietotājvārds
   */
  getUser(username: string): Observable<User> {
    return this.httpService.getUserHttp(username);
  }
  /**
   * Saņem klientu sarakstu no REST
   */
  getCustomers(): Observable<Customer[]> {
    return this.httpService.getCustomersHttp().pipe(
      map(customer => customer.map(cust => ({ name: cust || 'Nav norādīts', value: cust })))
    );
  }
  /**
   * Atjauno lietotāja iestatījumus, izņemot paroli
   * @param username Lietotājvārds
   * @param data Atjaunojamie dati, bet ne parole!
   */
  updateUser(username: string, data: Partial<User>): Observable<boolean> {
    return this.httpService.updateUserHttp({ username, ...data }).pipe(
      map(resp => resp.success),
      tap(resp => resp && this.updateUsers(username, data)),
    );
  }
  /**
   * Nomaina paroli lietotājam
   * @param username lietotājvārds
   * @param password parole
   */
  updatePassword(username: string, password: string): Observable<boolean> {
    return this.httpService.updatePasswordHttp(username, password);
  }
  /**
   * Pievieno lietotāju,
   * atjauno lietotāju sarakstu
   * @param data Pilni lietotāja dati
   */
  addUser(data: Partial< User>): Observable<boolean> {
    return this.httpService.addUserHttp(data).pipe(
      tap(resp => resp && this.getUsers()),
    );
  }
  /**
   * Rezultāts: Observable
   * true -  ja lietotāja vārds nav aizņemts un derīgs
   * false - ja lietotāja vārds aizņemts
   * @param username Pārbaudāmais lietotāja vārds
   */
  validateUsername(username: string): Observable<boolean> {
    return this.getUser(username).pipe(
      map(res => res ? false : true),
    );
  }

  /**
   * Atsvaidzina statisko lietotāju sarakstu
   * @param username Lietotājvārds
   * @param update Izmaiņas
   */
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
