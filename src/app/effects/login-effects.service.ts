import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, tap, mergeMap, switchMap } from 'rxjs/operators';
import { PrdApiService } from '../services/index';
import * as LoginActions from '../actions/login.actions';
import { User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class LoginEffectsService {

  constructor(
    private prdApi: PrdApiService,
    private actions$: Actions,
    private router: Router,
    private snack: MatSnackBar,
  ) { }

  logIn$ = createEffect(
    () => this.actions$.pipe(
      ofType(LoginActions.login),
      switchMap(action => this.prdApi.login.login(action)),
      map(user => user ? LoginActions.apiLoggedIn({ user }) : LoginActions.apiNotLoggedIn({ error: 'Not logged in' })),
    )
  );

  logOut$ = createEffect(
    () => this.actions$.pipe(
      ofType(LoginActions.logout),
      switchMap(() => this.prdApi.login.logout()),
      map(() => LoginActions.apiLoggedOut(),
      )
    )
  );

  apiLogInSuccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(LoginActions.apiLoggedIn),
      tap(() => this.router.navigate(['/'])),
      map(user => LoginActions.apiUserReceived(user))
    )
  );

  apiLoginFail$ = createEffect(
    () => this.actions$.pipe(
      ofType(LoginActions.apiNotLoggedIn),
      tap(() =>
        this.snack.open('Nepareiza parole vai lietotājs', 'OK', { duration: 5000 })
      )
    ),
    { dispatch: false }
  );

  getUser$ = createEffect(
    () => this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() => this.prdApi.login.get('')),
      map(user => LoginActions.apiUserReceived({ user }))
    )
  );

}
