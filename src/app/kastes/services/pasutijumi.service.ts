import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Pasutijums } from './pasutijums';
import { KastesHttpService } from './kastes-http.service';
import { KastesPreferencesService } from './kastes-preferences.service';
import { tap, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PasutijumiService {
  private _pasutijumi: Pasutijums[];
  constructor(
    private kastesHttpService: KastesHttpService,
    private kastesPreferencesService: KastesPreferencesService,
  ) { }

  get pasutijumi(): Observable<Pasutijums[]> {
    if (!this._pasutijumi) {
      return this.kastesHttpService.getPasutijumiHttp().pipe(
        tap(pas => this._pasutijumi = pas)
      );
    } else {
      return of(this._pasutijumi);
    }
  }

  setPasutijums(id: string): Observable<boolean> {
    console.log(id);
    return this.kastesPreferencesService.update({ pasutijums: id });
  }

  addPasutijums(name: string): Observable<string> {
    let id: string;
    return this.kastesHttpService.addPasutijumsHttp(name).pipe(
      tap(({ _id }) => id = _id),
      switchMap(() => this.kastesHttpService.getPasutijumiHttp()),
      tap(pas => this._pasutijumi = pas),
      map(() => id)
    );
  }

}
