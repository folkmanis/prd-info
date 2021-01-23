/**
 * Piedāvā:
 * user$ - lietotāja info pakete
 * modules$ - pieejamie moduļi
 * isLogin$ - vai ir pieslēgums
 * login() - mēģinājums pieslēgties
 * logout() - atslēgšanās
 *
 * Klausās:
 * login()
 * logout()
 *
 *
 */

import { Inject, Injectable } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { map, shareReplay, take, tap } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams, Login, SystemPreferencesMap, User } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _user$: Observable<User | undefined>;
  private readonly _updateLogin$ = new Subject<User | undefined>();

  constructor(
    private prdApi: PrdApiService,
  ) { }
  /**
   * Multicast Observable ar aktīvā lietotāja informāciju
   * Dod rezultātu, mainoties lietotājam (login/logout)
   */
  get user$(): Observable<User | undefined> {
    if (!this._user$) {
      this._user$ = merge(
        this.prdApi.login.get(''),
        this._updateLogin$,
      ).pipe(
        shareReplay(1),
      );
    }
    return this._user$;
  }
  /**
   * Vai ir aktīvs login
   */
  get isLogin$(): Observable<boolean> {
    return this.user$.pipe(
      map(usr => !!usr),
      take(1)
    );
  }
  /**
   * Login. true - veiksmīgi, false - neveiksmīgi
   * Bez sīkākas informācijas no servera
   * @param login Lietotājvārda objekts
   */
  logIn(login: Login): Observable<boolean> {
    return this.prdApi.login.login(login).pipe(
      tap(usr => this._updateLogin$.next(usr)),
      map(usr => !!usr),
    );
  }
  /**
   * Atslēgties.
   * Iztukšo lietotāja objektu, līdz ar to mainās visas preferences
   */
  logOut(): Observable<boolean> {
    return this.prdApi.login.logout().pipe(
      tap(resp => !resp || this._updateLogin$.next(null)),
    );
  }

  /**
   * Vai lietotājam ir pieejams modulis mod
   * @param mod moduļa nosaukums
   */
  isModule(mod: string): Observable<boolean> {
    return this.user$.pipe(
      take(1),
      map(usr => usr && !!usr.preferences.modules.find(m => m === mod)),
    );
  }


}
