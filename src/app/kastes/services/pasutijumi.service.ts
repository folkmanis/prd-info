import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Pasutijums } from './pasutijums';
import { KastesHttpService } from './kastes-http.service';
import { KastesPreferencesService } from './kastes-preferences.service';
import { tap, map, switchMap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PasutijumiService {
  private pasutijumi$: BehaviorSubject<Pasutijums[]> = new BehaviorSubject([]);
  private loded = false;
  private update = false;
  constructor(
    private kastesHttpService: KastesHttpService,
    private kastesPreferencesService: KastesPreferencesService,
  ) { }

  get pasutijumi(): Observable<Pasutijums[]> {
    if (!this.loded && !this.update) {
      this.loadPasutijumi();
    }
    return this.pasutijumi$;
  }

  setPasutijums(id: string): Observable<boolean> {
    return this.kastesPreferencesService.update({ pasutijums: id });
  }

  addPasutijums(name: string): Observable<string> {
    return this.kastesHttpService.addPasutijumsHttp(name).pipe(
      tap(() => this.loadPasutijumi),
      map(({ _id }) => _id)
    );
  }

  updatePasutijums(pas: Pasutijums): Observable<boolean> {
    return this.kastesHttpService.updatePasutijums(pas).pipe(
      map(res => !!res.changedRows),
      tap(upd => upd && this.loadPasutijumi()),
    );
  }

  private loadPasutijumi() {
    this.update = true;
    this.kastesHttpService.getPasutijumiHttp().subscribe(pas => {
      this.pasutijumi$.next(pas);
      this.update = false;
      this.loded = true;
    });
  }

}
