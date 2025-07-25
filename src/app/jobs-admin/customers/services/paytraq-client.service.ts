import { Injectable, inject } from '@angular/core';
import { PaytraqApiService } from 'src/app/services/prd-api/paytraq-api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Pt from 'src/app/interfaces/paytraq';

@Injectable({
  providedIn: 'root',
})
export class PaytraqClientService {
  private api = inject(PaytraqApiService);

  getClients(query: Pt.RequestOptions = {}): Observable<Pt.PaytraqClient[]> {
    return this.api.getClients(query).pipe(map((cl) => cl?.client || []));
  }

  async getClientShippingAddresses(clientId: number): Promise<Pt.PaytraqShippingAddress[]> {
    return this.api.getClientShippingAddresses(clientId);
  }
}
