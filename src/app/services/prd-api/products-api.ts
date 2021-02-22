import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerProduct, Product, ProductResponse } from 'src/app/interfaces';
import { ApiBase, HttpOptions } from 'src/app/library';

interface CustomerProductPrice {
    customerName: string;
    product: string;
    price?: number | null;
}

export class ProductsApi extends ApiBase<Product> {

    productsCustomer(customer: string): Observable<CustomerProduct[]> {
        return this.http.get<ProductResponse>(
            this.path + 'prices/customer/' + customer,
            new HttpOptions().cacheable(),
        ).pipe(
            map(resp => resp.customerProducts)
        );

    }
    /** Preču cenas vairākiem klientu un preču */
    customersProducts(customerProducts: CustomerProductPrice[]): Observable<CustomerProductPrice[]> {
        return this.http.get<{ data: CustomerProductPrice[] }>(
            this.path + 'prices/customers',
            new HttpOptions({ filter: JSON.stringify(customerProducts) })
        ).pipe(
            map(resp => resp.data)
        );
    }

}
