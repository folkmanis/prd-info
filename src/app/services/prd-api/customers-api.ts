import { HttpClient } from '@angular/common/http';
import { ApiBase } from 'src/app/library';
import { Customer } from 'src/app/interfaces';

export class CustomersApi extends ApiBase<Customer> {

    constructor(
        http: HttpClient, path: string
    ) {
        super(http, path + 'customers/');
    }

}
