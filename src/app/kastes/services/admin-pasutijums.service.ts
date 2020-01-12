import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Pasutijums } from './pasutijums';
import { AdminHttpService } from './admin-http.service';

@Injectable({
  providedIn: 'root'
})
export class AdminPasutijumsService {

  private pasutijumi: Pasutijums[] = [];

  constructor(
    private adminHttpService: AdminHttpService,
  ) { }

/**
 * Izsniedz pasūtījumu sarakstu kā Observable<Pasutijums[]>
 * Ja vienreiz jau saņemts, tad izsniedz saglabāto kopiju
 */
  getPasutijumi(dirty: boolean = false): Observable<Pasutijums[]> {
    if (this.pasutijumi.length && !dirty) {
      return of(this.pasutijumi);
    } else {
      return this.adminHttpService.getPasutijumiHttp().pipe(
        map((pas) => {
          this.pasutijumi = pas;
          this.pasutijumi.push({ id: 0, pasutijums: 'Nav noteikts' });
          return this.pasutijumi;
        })
      );
    }
  }

  addPasutijums(pasName: string): Observable<number> {
    let insertId: number;
    return this.adminHttpService.postPasutijumsHttp({ pasutijums: pasName }).pipe(
      tap((res) => insertId = res.insertId),
      switchMap(() => this.getPasutijumi(true)),
      map(() => insertId),
    );
  }

  deletePasutijums(id: number): Observable<Pasutijums[] | null> {
    // Pieprasījums serverim izņemt pasūtījumu ierakstu
    return this.adminHttpService.deletePasutijums(id).pipe(
      switchMap(() => this.getPasutijumi(true))
    );
  }



}
