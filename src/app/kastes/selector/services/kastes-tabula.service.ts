import { Injectable } from '@angular/core';
import { cacheWithUpdate } from 'src/app/library/rxjs';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  Colors,
  COLORS,
  Totals,
  VeikalsKaste,
} from 'src/app/kastes/interfaces';
import { combineReload } from 'src/app/library/rxjs';
import { KastesApiService } from '../../services/kastes-api.service';

@Injectable({
  providedIn: 'any',
})
export class KastesTabulaService {
  constructor(private api: KastesApiService) {}

  kastesAll(
    pasutijumsId: Observable<number>,
    reload: Observable<void>,
    update: Observable<VeikalsKaste>
  ): Observable<VeikalsKaste[]> {
    return combineReload(pasutijumsId, reload).pipe(
      switchMap((id) => this.api.getKastes(id)),
      cacheWithUpdate(
        update,
        (o1, o2) => o1._id === o2._id && o1.kaste === o2.kaste
      )
    );
  }

  setGatavs(kaste: VeikalsKaste, yesno: boolean): Observable<VeikalsKaste> {
    return this.api.setGatavs(kaste, yesno);
  }

  setLabel(kods: number, pasutijums: number): Observable<VeikalsKaste | null> {
    return this.api.setLabel({ pasutijums, kods });
  }

  getApjomi(pasutijumsId: number): Observable<number[]> {
    return this.api.getApjomi(pasutijumsId);
  }

  getKastes(pasutijumsId: number): Observable<VeikalsKaste[]> {
    return this.api.getKastes(pasutijumsId);
  }

  calcTotals(kastes: VeikalsKaste[]): Totals {
    const colorsPakas = kastes.reduce(
      (total, curr) => {
        const _ =
          curr.kastes.gatavs ||
          Object.keys(total).forEach((key) => (total[key] += curr.kastes[key]));
        return total;
      },
      { yellow: 0, rose: 0, white: 0 }
    );
    return {
      total: kastes.length,
      kastes: kastes.reduce(
        (total, curr) => (total += curr.kastes.gatavs ? 0 : 1),
        0
      ),
      labels: kastes.reduce(
        (total, curr) => (total += curr.kastes.uzlime ? 0 : 1),
        0
      ),
      colorTotals: COLORS.map((k: Colors) => ({
        color: k,
        total: colorsPakas[k],
      })),
    };
  }
}
