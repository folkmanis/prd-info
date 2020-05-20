import { AdminHttpService } from './admin-http.service';
import { User } from 'src/app/interfaces';
import { Injectable } from '@angular/core';
import { Observable, Subject, of, merge } from 'rxjs';
import { map, tap, filter, switchMap, startWith } from 'rxjs/operators';
import { USER_MODULES } from '../../../user-modules';
import { UserModule } from 'src/app/interfaces';

export interface Customer {
  name: string;
  value: string;
}

@Injectable()
export class UsersService {

  private usersCache: User[];
  constructor(
    private httpService: AdminHttpService,
  ) { }
  reloadUsers$ = new Subject<void>();
  private _usersHttp$: Observable<User[]> = this.reloadUsers$.pipe(
    startWith({}),
    switchMap(() => this.httpService.getUsersHttp()),
    map(uList => uList.users),
    tap(users => this.usersCache = users)
  );
  private _usersCached$: Subject<User[]> = new Subject();
  users$ = merge(this._usersHttp$, this._usersCached$);
  /**
   * Klientu saraksts
   */
  customers$: Observable<Customer[]> = this.httpService.getCustomersHttp().pipe(
    map(customer => customer.map(cust => ({ name: cust || 'Nenoteikts', value: cust })))
  );
  /**
   * Saņem lietotāja ierakstu no REST
   * @param username Lietotājvārds
   */
  getUser(username: string): Observable<User> {
    return this.httpService.getUserHttp(username);
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
  addUser(data: Partial<User>): Observable<boolean> {
    return this.httpService.addUserHttp(data).pipe(
      tap(resp => resp && this.reloadUsers$.next()),
    );
  }
  /**
   * Izdzēš lietotāju, atjauno lietotāju sarakstu
   * @param username Lietotājvārds
   */
  deleteUser(username: string): Observable<boolean> {
    return this.httpService.deleteUserHttp(username).pipe(
      tap(resp => resp && this.reloadUsers$.next()),
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
      map(res => !res),
    );
  }

  getUserModules(): UserModule[] {
    return USER_MODULES;
  }

  /**
   * Atsvaidzina lietotāju statiskajā sarakstā
   * @param username Lietotājvārds
   * @param update Izmaiņas
   */
  private updateUsers(username: string, update: Partial<User>): void {
    if (!this.usersCache) {
      this.reloadUsers$.next();
      return;
    }
    const idx = this.usersCache.findIndex(usr => usr.username === username);
    if (idx === -1) { return; } // Ja lietotājs nav sarakstā
    const updUsr: User = { ...this.usersCache[idx] };
    for (const key of Object.keys(update)) {
      updUsr[key] = update[key];
    }
    this.usersCache[idx] = updUsr;
    this._usersCached$.next(this.usersCache);
  }

}
