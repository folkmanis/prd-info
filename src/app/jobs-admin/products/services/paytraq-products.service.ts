import { Injectable } from '@angular/core';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { Observable } from 'rxjs';
import { pluck, map } from 'rxjs/operators';
import * as Pt from 'src/app/interfaces/paytraq';

@Injectable({
  providedIn: 'any'
})
export class PaytraqProductsService {

  constructor(
    private api: PrdApiService,
  ) { }

  getProducts(query: Pt.RequestOptions = {}): Observable<Pt.PaytraqProduct[]> {
    return this.api.paytraq.getProducts(query).pipe(
      pluck('product'),
      map(pr => pr || [])
    );
  }
}
