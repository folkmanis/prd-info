import { TimeStamps } from './timestamps';

export interface Clients {
    clients: {
        client: Client[];
    };
}

export interface Client {
    clientID: number;
    name: string;
    type: number;
    status: number;
    regNumber: string;
    vatNumber: string;
    legalAddress: LegalAddress;
    financialData: FinancialData;
    timeStamps: TimeStamps;
}

export interface LegalAddress {
    address: string;
    zip: string;
    country: string;
}

export interface FinancialData {
    creditLimit: number;
    deposit: number;
    discount: number;
    payTerm: PayTerm;
    priceGroup: PriceGroup;
}

export interface PayTerm {
    payTermType: number;
    payTermDays: number;
}

export interface PriceGroup {
    priceGroupID: number;
    priceGroupName: string;
}
