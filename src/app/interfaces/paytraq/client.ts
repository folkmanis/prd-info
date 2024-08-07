import { TimeStamps } from './timestamps';

export interface PaytraqClients {
  client: PaytraqClient[];
}

export interface PaytraqClient {
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

export interface PaytraqShippingAddress {
  addressID: number;
  shipTo: string;
  address: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface PaytraqShippingAddresses {
  shippingAddresses: { shippingAddress: PaytraqShippingAddress }[];
}
