import { AppHttpResponseBase } from 'src/app/library/http/http-response-base';

export interface Customer {
    _id: string;
    code?: string;
    CustomerName: string;
    disabled?: boolean;
    insertedFromXmf?: Date;
    description: string;
}

export type CustomerPartial = Pick<Customer, '_id' | 'CustomerName' | 'code'>;

export interface CustomerResponse extends AppHttpResponseBase {
    customer?: Customer;
    customers?: CustomerPartial[];
}
