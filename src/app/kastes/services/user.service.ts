import { Injectable, EventEmitter } from '@angular/core';
import { Observable, pipe, from, of, merge } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpService } from './http.service';

export class User {
  username = '';
  name = '';
  id = 0;
  admin = false;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User;
  private userEmiter = new EventEmitter<User>();
  userObserver: Observable<User> = merge(
    this.userEmiter,
    this.getUser()
  );

  constructor(
    private httpService: HttpService
  ) {
  }

  /**
   * Login funkcija
   * Atbilde: number 0 - nesekmīgi, 1 - sekmīgi
   * @param u Lietotājvārds
   * @param pw Parole
   */
  logIn(u: string, pw: string): Observable<number> { // login funkcija, user(id) - pieslēgts, 0 - nav
    return this.httpService.logInHttp({ username: u, pass: pw })
      .pipe(
        map((resp) => {
          if (resp.id) {
            this.user = resp;
            this.userEmiter.emit(this.user);
            return this.user.id;
          } else {
            return 0;
          }
        })
      );
  }
  /**
   * Atslēdz lietotāju
   * r=0 nesekmīgi, r=1 sekmīgi
   */
  logOut(): Observable<number> {  // atslēdz lietotāju. numuru redz no cepuma
    return this.httpService.logOutHttp()
      .pipe(
        tap(() => {
          this.clear();
          this.userEmiter.emit(this.user);
        })
      );
  }

  public getUser(): Observable<User> {
    if (this.user) {
      return of(this.user);
    } else {
      return this.httpService.getUserHttp().pipe(
        map((resp) => {
          if (resp.id) {
            this.user = resp;
            return this.user;
          } else {
            return null;
          }
        })
      );
    }
  }

  public clear() {
    this.user = null;
  }

  public get isAdmin$(): Observable< boolean> {
    return this.getUser().pipe(
      map((user) => !!user.admin)
    );
  }

}
