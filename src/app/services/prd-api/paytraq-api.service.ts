import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getAppParams } from 'src/app/app-params';
import * as Pt from 'src/app/interfaces/paytraq';
import { cacheable, httpParams } from 'src/app/library';

function asArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val];
}

@Service()
export class PaytraqApiService {
  readonly path = getAppParams('apiPath') + 'paytraq/';
  private http = inject(HttpClient);

  getClients(filter: Pt.RequestOptions): Observable<Pt.PaytraqClients> {
    const query = Pt.RequestOptionsSchema.encode(filter);
    return this.http
      .get<{ clients: Pt.PaytraqClients }>(this.path + 'clients', httpParams(query).cacheable())
      .pipe(map((data) => data.clients));
  }

  async getClientShippingAddresses(id: number): Promise<Pt.PaytraqShippingAddress[]> {
    const { shippingAddresses } = await firstValueFrom(
      this.http.get<Pt.PaytraqShippingAddresses>(this.path + 'client/shippingAddresses/' + id),
    );
    return shippingAddresses.length > 0 ? asArray(shippingAddresses[0].shippingAddress) : [];
  }

  getProducts(filter?: Pt.RequestOptions): Observable<Pt.PaytraqProducts> {
    const query = Pt.RequestOptionsSchema.optional().encode(filter);
    return this.http
      .get<{ products: Pt.PaytraqProducts }>(this.path + 'products', httpParams(query).cacheable())
      .pipe(map((data) => data.products));
  }

  async getSale(id: number): Promise<Pt.PaytraqInvoice> {
    return firstValueFrom(this.http.get<Pt.PaytraqInvoice>(this.path + 'sale/' + id, cacheable()));
  }

  async postSale(data: Pt.PaytraqInvoice): Promise<Pt.PaytraqNewInvoiceResponse> {
    return firstValueFrom(this.http.put<Pt.PaytraqNewInvoiceResponse>(this.path + 'sale', { data }));
  }
}
