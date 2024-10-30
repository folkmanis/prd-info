import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getAppParams } from 'src/app/app-params';
import * as Pt from 'src/app/interfaces/paytraq';
import { HttpOptions } from 'src/app/library/http';

function asArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val];
}

@Injectable({
  providedIn: 'root',
})
export class PaytraqApiService {
  readonly path = getAppParams('apiPath') + 'paytraq/';
  private http = inject(HttpClient);

  getClients(query: Pt.RequestOptions): Observable<Pt.PaytraqClients> {
    return this.http.get<{ clients: Pt.PaytraqClients }>(this.path + 'clients', new HttpOptions(query).cacheable()).pipe(map((data) => data.clients));
  }

  async getClientShippingAddresses(id: number): Promise<Pt.PaytraqShippingAddress[]> {
    const { shippingAddresses } = await firstValueFrom(this.http.get<Pt.PaytraqShippingAddresses>(this.path + 'client/shippingAddresses/' + id));
    return shippingAddresses.length > 0 ? asArray(shippingAddresses[0].shippingAddress) : [];
  }

  getProducts(query: Pt.RequestOptions): Observable<Pt.PaytraqProducts> {
    return this.http.get<{ products: Pt.PaytraqProducts }>(this.path + 'products', new HttpOptions(query).cacheable()).pipe(map((data) => data.products));
  }

  async getSale(id: number): Promise<Pt.PaytraqInvoice> {
    return firstValueFrom(this.http.get<Pt.PaytraqInvoice>(this.path + 'sale/' + id, new HttpOptions().cacheable()));
  }

  async postSale(data: Pt.PaytraqInvoice): Promise<Pt.PaytraqNewInvoiceResponse> {
    return firstValueFrom(this.http.put<Pt.PaytraqNewInvoiceResponse>(this.path + 'sale', { data }, new HttpOptions()));
  }
}
