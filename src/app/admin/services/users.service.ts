import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { XmfCustomer } from 'src/app/xmf-search/interfaces';
import { XmfArchiveApiService } from 'src/app/xmf-search/services/xmf-archive-api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private reload$ = new Subject<void>();

  users$ = this.reload$.pipe(
    startWith({}),
    switchMap(() => this.prdApi.users.get()),
  );

  xmfCustomers$: Observable<XmfCustomer[]> = this.xmfApi.getXmfCustomer().pipe(
    map(customer => customer.map(cust => ({ name: cust || 'Nenoteikts', value: cust })))
  );


  constructor(
    private prdApi: PrdApiService,
    private xmfApi: XmfArchiveApiService,
  ) { }


  getUser(username: string): Observable<User> {
    return this.prdApi.users.get(username);
  }

  updateUser({ username, ...update }: Partial<User>): Observable<User> {
    if (!username) {
      return throwError(new Error('Username missing'));
    }
    return this.prdApi.users.updateOne(username, update).pipe(
      tap(_ => this.reload$.next()),
    );
  }

  updatePassword(username: string, password: string): Observable<User> {
    return this.prdApi.users.passwordUpdate(username, password);
  }

  addUser(data: Partial<User>): Observable<User> {
    return this.prdApi.users.insertOne(data).pipe(
      tap(_ => this.reload$.next()),
    );
  }

  deleteUser(username: string): Observable<boolean> {
    return this.prdApi.users.deleteOne(username).pipe(
      map(resp => resp > 0),
      tap(resp => resp && this.reload$.next()),
    );
  }

  deleteSessions(username: string, sessionIds: string[]): Observable<number> {
    return this.prdApi.users.deleteSessions(username, sessionIds);
  }

  validateUsername(username: string): Observable<boolean> {
    return this.prdApi.users.validatorData('username').pipe(
      map(names => !names.includes(username)),
    );
  }

}
