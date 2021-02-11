import { Injectable } from '@angular/core';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import * as Pt from 'src/app/interfaces/paytraq';

@Injectable({ providedIn: 'any' })
export class PaytraqClientService {

  constructor(
    private api: PrdApiService,
  ) { }

  getClients(query: Pt.RequestOptions = {}): Observable<Pt.PaytraqClient[]> {
    return this.api.paytraq.getClients(query).pipe(
      pluck('clients', 'client'),
      map(cl => cl || [])
    );
  }

}
