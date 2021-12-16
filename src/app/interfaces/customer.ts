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
    description: string | undefined;
    financial?: CustomerFinancial;
}

export type CustomerPartial = Pick<Customer, '_id' | 'CustomerName' | 'code' | 'disabled'>;

export type NewCustomer = Pick<Customer, 'CustomerName' | 'disabled' | 'code' | 'description'>;

export const DEFAULT_CUSTOMER: NewCustomer = {
    CustomerName: '',
    disabled: false,
    code: '',
    description: undefined,
};

