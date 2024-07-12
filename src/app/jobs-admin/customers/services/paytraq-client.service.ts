import { Injectable } from '@angular/core';
import { PaytraqApiService } from 'src/app/services/prd-api/paytraq-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Pt from 'src/app/interfaces/paytraq';

@Injectable({
  providedIn: 'root',
})
export class PaytraqClientService {
  constructor(private api: PaytraqApiService) {}

  getClients(query: Pt.RequestOptions = {}): Observable<Pt.PaytraqClient[]> {
    return this.api.getClients(query).pipe(map((cl) => cl?.client || []));
  }
}
