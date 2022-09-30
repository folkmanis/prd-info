import { HttpContextToken, HttpEvent, HttpEventType, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, EMPTY, Observable, of, retry, tap, BehaviorSubject, Subject, ReplaySubject, merge } from 'rxjs';
import { KastesUserPreferences, VeikalsKaste } from '../../interfaces';

export class KastesLocalStorageToken {
  veikalsId: string = '';
  kaste: number;
  yesno: boolean = true;
}


export const USE_KASTES_STORAGE = new HttpContextToken<KastesLocalStorageToken>(() => new KastesLocalStorageToken());


@Injectable({
  providedIn: 'root'
})
export class KastesLocalStorageService {

  private storage = window.localStorage;

  private updatePendingCount$ = new ReplaySubject<number>(1);

  pendingCount$: Observable<number> = merge(
    of(this.kastesPendingCount()),
    this.updatePendingCount$,
  );

  constructor() { }

  storeVeikalsKastes(kastes: VeikalsKaste[]) {
    this.storage.setItem('veikalsKastes', JSON.stringify(kastes));
    this.updatePendingCount$.next(this.kastesPendingCount());
  }


  updateStoredKaste(kaste: VeikalsKaste) {

    const kastes = this.getKastes();
    const idx = kastes.findIndex(k => k._id === kaste._id && k.kaste === kaste.kaste);

    if (idx > -1) {
      kastes[idx] = kaste;
      this.storeVeikalsKastes(kastes);
    }

  }

  getKastes(): VeikalsKaste[] {
    const kastes = JSON.parse(this.storage.getItem('veikalsKastes'));
    if (Array.isArray(kastes)) {
      return kastes;
    } else {
      return [];
    }
  }

  kastesPendingCount(): number {
    return this.getKastes().reduce((acc, kaste) => kaste.pending ? acc + 1 : acc, 0);
  }

}
