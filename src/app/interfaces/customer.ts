export interface CustomerFinancial {
    clientName: string;
    paytraqId?: number;
}

export interface FtpUserData {
    folder: string;
    username: string;
    password: string;
}

export interface Customer {
    _id: string;
    code: string;
    CustomerName: string;
    disabled: boolean;
    insertedFromXmf?: Date;
    description: string | undefined;
    financial?: CustomerFinancial;
    ftpUser: boolean;
    ftpUserData?: FtpUserData;
}

export type CustomerPartial = Pick<Customer, '_id' | 'CustomerName' | 'code' | 'disabled'>;

export type NewCustomer = Pick<Customer, 'CustomerName' | 'disabled' | 'code' | 'description' | 'ftpUser'>;

export const DEFAULT_CUSTOMER: NewCustomer = {
    CustomerName: '',
    disabled: false,
    code: '',
    description: undefined,
    ftpUser: false,
};

