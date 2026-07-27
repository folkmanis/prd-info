import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestOptions, PaytraqProduct } from 'src/app/interfaces/paytraq';
import { PaytraqApiService } from 'src/app/services/prd-api/paytraq-api.service';

@Service()
export class PaytraqProductsService {
  private api = inject(PaytraqApiService);

  getProducts(filter?: RequestOptions): Observable<PaytraqProduct[]> {
    return this.api.getProducts(filter).pipe(map((pr) => pr?.product || []));
  }
}
