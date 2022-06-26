import { Expose, Type } from 'class-transformer';

export class CustomerFinancial {

    @Expose()
    clientName: string;

    @Expose()
    paytraqId?: number;
}

export class FtpUserData {

    @Expose()
    folder: string = '';

    @Expose()
    username: string = '';

    @Expose()
    password: string = '';
}

export class CustomerContact {

    @Expose()
    email: string;
}


export class Customer {

    @Expose()
    _id: string;

    @Expose()
    code: string;

    @Expose()
    CustomerName: string;

    @Expose()
    disabled: boolean = false;

    @Expose()
    @Type(() => Date)
    insertedFromXmf: Date = null;

    @Expose()
    description: string | undefined;

    @Expose()
    @Type(() => CustomerFinancial)
    financial: CustomerFinancial = null;

    @Expose()
    ftpUser: boolean = false;

    @Expose()
    @Type(() => FtpUserData)
    ftpUserData: FtpUserData = null;

    @Expose()
    @Type(() => CustomerContact)
    contacts: CustomerContact[] = [];
}

export type CustomerPartial = Pick<Customer, '_id' | 'CustomerName' | 'code' | 'disabled'>;

export type NewCustomer = Pick<Customer, 'CustomerName' | 'disabled' | 'code' | 'description' | 'ftpUser' | 'contacts'>;

export type CustomerUpdate = Pick<Customer, '_id'> & Partial<Customer>;

export const DEFAULT_CUSTOMER: NewCustomer = {
    CustomerName: '',
    disabled: false,
    code: '',
    description: undefined,
    ftpUser: false,
    contacts: undefined,
};

