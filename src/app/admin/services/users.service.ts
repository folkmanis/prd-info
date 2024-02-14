import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/interfaces';
import { UsersApiService } from 'src/app/services/prd-api/users-api.service';
import { XmfCustomer } from 'src/app/xmf-search/interfaces';
import { XmfArchiveApiService } from 'src/app/xmf-search/services/xmf-archive-api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private reload$ = new Subject<void>();

  users$ = this.reload$.pipe(
    startWith({}),
    switchMap(() => this.api.getAll({}))
  );

  constructor(
    private api: UsersApiService,
    private xmfApi: XmfArchiveApiService
  ) { }

  getXmfCustomers(): Observable<XmfCustomer[]> {
    return this.xmfApi
      .getXmfCustomer()
      .pipe(
        map((customer) =>
          customer.map((cust) => ({ name: cust || 'Nenoteikts', value: cust }))
        )
      );
  }

  getUser(username: string): Observable<User> {
    return this.api.getOne(username);
  }

  updateUser({ username, ...update }: Partial<User>): Observable<User> {
    return this.api
      .updateOne(username, update)
      .pipe(tap((_) => this.reload$.next()));
  }

  updatePassword(username: string, password: string): Observable<User> {
    return this.api.passwordUpdate(username, password);
  }

  addUser(data: Partial<User>): Observable<User> {
    return this.api.insertOne(data).pipe(tap((_) => this.reload$.next()));
  }

  deleteUser(username: string): Observable<boolean> {
    return this.api.deleteOne(username).pipe(
      tap((resp) => {
        if (!resp) throw new Error('User delete failed');
      }),
      tap((resp) => resp && this.reload$.next())
    );
  }

  deleteSessions(username: string, sessionIds: string[]): Observable<number> {
    return this.api.deleteSessions(username, sessionIds);
  }

  uploadToFirestore(username: string) {
    return this.api.uploadToFirestore(username);
  }

  validateUsername(username: string): Observable<boolean> {
    return this.api
      .validatorData('username')
      .pipe(map((names) => !names.includes(username)));
  }
}
