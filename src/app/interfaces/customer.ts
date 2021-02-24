import { AppHttpResponseBase } from 'src/app/library/http';

export interface CustomerFinancial {
    clientName: string;
    paytraqId?: number;
}

export interface Customer {
    _id: string;
    code: string;
    CustomerName: string;
    disabled: boolean;
    insertedFromXmf?: Date;
    description: string;
    financial?: CustomerFinancial;
}

export interface CustomerResponse extends AppHttpResponseBase<Customer> {
    insertedId: string;
    customers: CustomerPartial[];
    customer: Customer | null;
}

export type CustomerPartial = Pick<Customer, '_id' | 'CustomerName' | 'code' | 'disabled'>;

export type NewCustomer = Pick<Customer, 'CustomerName' | 'disabled' | 'code' | 'description'>;
