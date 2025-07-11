import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Pt from 'src/app/interfaces/paytraq';
import { PaytraqApiService } from 'src/app/services/prd-api/paytraq-api.service';

@Injectable({
  providedIn: 'root',
})
export class PaytraqProductsService {
  private api = inject(PaytraqApiService);

  getProducts(query: Pt.RequestOptions = {}): Observable<Pt.PaytraqProduct[]> {
    return this.api.getProducts(query).pipe(map((pr) => pr?.product || []));
  }
}
