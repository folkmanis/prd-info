import { Injectable } from '@angular/core';
import { EMPTY, from, merge, Observable, Subject } from 'rxjs';
import { concatMap, map, mergeMap, reduce, startWith, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { XmfCustomer } from 'src/app/interfaces/xmf-search';

@Injectable({
  providedIn: 'any'
})
export class UsersService {

  private usersCache: Partial<User>[];

  constructor(
    private prdApi: PrdApiService,
  ) { }

  reloadUsers$ = new Subject<void>();
  private _usersHttp$: Observable<Partial<User>[]> = this.reloadUsers$.pipe(
    startWith({}),
    switchMap(() => this.prdApi.users.get()),
    tap(users => this.usersCache = users)
  );
  private _usersCached$: Subject<Partial<User>[]> = new Subject();
  users$ = merge(this._usersHttp$, this._usersCached$);
  /**
   * Klientu saraksts
   */
  xmfCustomers$: Observable<XmfCustomer[]> = this.prdApi.xmfArchive.getXmfCustomer().pipe(
    map(customer => customer.map(cust => ({ name: cust || 'Nenoteikts', value: cust })))
  );
  /**
   * Saņem lietotāja ierakstu no REST
   *
   * @param username Lietotājvārds
   */
  getUser(username: string): Observable<User> {
    return this.prdApi.users.get(username);
  }
  /**
   * Atjauno lietotāja iestatījumus, izņemot paroli
   *
   * @param username Lietotājvārds
   * @param user Atjaunojamie dati, bet ne parole!
   */
  updateUser(user: Partial<User>): Observable<boolean> {
    if (!user.username) { return EMPTY; }
    return this.prdApi.users.updateOne(user.username, user).pipe(
      tap(resp => resp && this.updateUsers(user)),
    );
  }
  /**
   * Nomaina paroli lietotājam
   *
   * @param username lietotājvārds
   * @param password parole
   */
  updatePassword(username: string, password: string): Observable<boolean> {
    return this.prdApi.users.passwordUpdate(username, password);
  }
  /**
   * Pievieno lietotāju,
   * atjauno lietotāju sarakstu
   *
   * @param data Pilni lietotāja dati
   */
  addUser(data: Partial<User>): Observable<boolean> {
    return this.prdApi.users.insertOne(data).pipe(
      map(userName => !!userName),
      tap(resp => resp && this.reloadUsers$.next()),
    );
  }
  /**
   * Izdzēš lietotāju, atjauno lietotāju sarakstu
   *
   * @param username Lietotājvārds
   */
  deleteUser(username: string): Observable<boolean> {
    return this.prdApi.users.deleteOne(username).pipe(
      map(resp => !!resp),
      tap(resp => resp && this.reloadUsers$.next()),
    );
  }

  deleteSession(...sessionIds: string[]): Observable<number> {
    return from(sessionIds).pipe(
      concatMap(id => this.prdApi.users.deleteSession(id)),
      reduce((acc, resp) => acc + resp, 0),
    );
  }
  /**
   * Rezultāts: Observable
   * true -  ja lietotāja vārds nav aizņemts un derīgs
   * false - ja lietotāja vārds aizņemts
   *
   * @param username Pārbaudāmais lietotāja vārds
   */
  validateUsername(username: string): Observable<boolean> {
    return this.getUser(username).pipe(
      map(res => !res),
    );
  }
  /**
   * Atsvaidzina lietotāju statiskajā sarakstā
   *
   * @param username Lietotājvārds
   * @param update Izmaiņas
   */
  private updateUsers(update: Partial<User>): void {
    if (!this.usersCache) {
      this.reloadUsers$.next();
      return;
    }
    const idx = this.usersCache.findIndex(usr => usr.username === update.username);
    if (idx === -1) { return; } // Ja lietotājs nav sarakstā
    const updUsr = { ...this.usersCache[idx] };
    for (const key of Object.keys(update)) {
      updUsr[key] = update[key];
    }
    this.usersCache[idx] = updUsr;
    this._usersCached$.next(this.usersCache);
  }

}
