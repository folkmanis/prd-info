import { AppHttpResponseBase } from 'src/app/library';

export interface Customer {
    _id: string;
    code?: string;
    CustomerName: string;
    disabled?: boolean;
    insertedFromXmf?: Date;
    description: string;
    financial?: {
        clientName: string;
    };
}

export interface CustomerResponse extends AppHttpResponseBase<Customer> {
    insertedId: string;
    customers: CustomerPartial[];
    customer: Customer | null;
}

export type CustomerPartial = Pick<Customer, '_id' | 'CustomerName' | 'code'>;

