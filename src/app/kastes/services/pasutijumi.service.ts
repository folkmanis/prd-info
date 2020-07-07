import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { Pasutijums } from '../interfaces';
import { KastesHttpService, CleanupResponse } from './kastes-http.service';
import { KastesPreferencesService } from './kastes-preferences.service';
import { tap, map, switchMap, filter } from 'rxjs/operators';

@Injectable()
export class PasutijumiService {
  private pasutijumi$: BehaviorSubject<Pasutijums[]> = new BehaviorSubject([]);
  private loaded = false;
  private update = false;
  constructor(
    private kastesHttpService: KastesHttpService,
    private kastesPreferencesService: KastesPreferencesService,
  ) { }

  get pasutijumi(): BehaviorSubject<Pasutijums[]> {
    if (!this.loaded && !this.update) {
      this.loadPasutijumi();
    }
    return this.pasutijumi$;
  }

  get ofPasutijumi(): Observable<Pasutijums[]> {
    if (this.loaded) {
      return of(this.pasutijumi$.value);
    } else {
      this.update = true;
      return this.pasutijumiUpdate();
    }
  }

  setPasutijums(id: string): Observable<boolean> {
    return this.kastesPreferencesService.updateUserPreferences({ pasutijums: id });
  }

  addPasutijums(name: string): Observable<string> {
    return this.kastesHttpService.addPasutijumsHttp(name).pipe(
      tap(() => this.loadPasutijumi()),
      map(({ _id }) => _id)
    );
  }

  updatePasutijums(pas: Partial<Pasutijums>): Observable<boolean> {
    if (!pas._id || !pas._id.length) {
      return of(false);
    }
    return this.kastesHttpService.updatePasutijums(pas).pipe(
      map(res => !!res.changedRows),
      tap(upd => upd && this.loadPasutijumi()),
    );
  }

  cleanup(): Observable<CleanupResponse> {
    return this.kastesHttpService.pasutijumiCleanup().pipe(
      tap(resp => (resp.deleted.pasutijumi || resp.deleted.veikali) && this.loadPasutijumi())
    );
  }

  private pasutijumiUpdate(): Observable<Pasutijums[]> {
    return this.kastesHttpService.getPasutijumiHttp().pipe(
      tap(pas => {
        this.pasutijumi$.next(pas);
        this.update = false;
        this.loaded = true;
      })
    );
  }

  private loadPasutijumi() {
    this.update = true;
    this.pasutijumiUpdate().subscribe();
  }

}
