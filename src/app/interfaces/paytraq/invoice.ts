import { TimeStamps } from './timestamps';

export interface PaytraqNewInvoiceResponse {
  response: {
    documentID: number;
  };
}

export interface PaytraqInvoice {
  sale: Sale;
}
export interface Sale {
  header: Header;
  lineItems: LineItems;
  adjustments?: Adjustments;
  shippingCharge?: ShippingCharge;
  taxes?: Taxes;
  totals?: Totals;
}
export interface Header {
  document: Document;
  saleType: 'sales_order' | 'sales_proforma' | 'sales_invoice' | 'sales_receipt' | 'sales_estimate' | 'credit_note';
  operation: 'sell_goods' | 'sell_services' | 'other_income';
  total?: number;
  amountDue?: number;
  dueNoticeEnabled?: boolean;
  currency?: string;
  balanceCurrency?: string;
  currencyRate?: number;
  taxBasis?: number;
  includeTax?: boolean;
  useOverpayment?: boolean;
  dateDue?: string;
  dateApproved?: string;
  discount?: number;
  signature?: number;
  invoicePeriod?: InvoicePeriod;
  payTerm?: PayTerm;
  paymentMethod?: number;
  accountID?: number;
  shippingData?: ShippingData;
  timeStamps?: TimeStamps;
}
export interface Document {
  documentID?: number;
  documentDate?: string;
  documentRef?: string;
  documentType?: string;
  documentStatus?: string;
  client: Client;
}
export interface Client {
  clientID: number;
  clientName?: string;
}
export interface InvoicePeriod {
  periodType?: number;
}
export interface PayTerm {
  payTermType?: number;
  payTermDays?: number;
}
export interface ShippingData {
  shippingType?: number;
  warehouse?: Warehouse;
  loadingArea?: LoadingArea;
  shipper?: Shipper;
  shippingAddress?: ShippingAddress;
}
export interface Warehouse {
  warehouseID?: number;
  warehouseName?: string;
}
export interface LoadingArea {
  loadingAreaID?: number;
  loadingAreaName?: string;
  loadingAreaAddress?: LoadingAreaAddress;
}
export interface LoadingAreaAddress {
  address?: string;
  zip?: string;
  country?: string;
}
export interface Shipper {
  shipperID?: number;
  shipperName?: string;
  shipperRegNumber?: number;
  shipperVehicle?: string;
  shipperDriver?: string;
}
export interface ShippingAddress {
  addressID?: number;
  shipTo?: string;
  address?: string;
  zip?: string;
  country?: string;
}
export interface LineItems {
  lineItem: LineItem[];
}
export interface LineItem {
  account?: Account;
  item: Item;
  description?: string;
  qty: number;
  price: number;
  lineDiscount?: number;
  lineTotal?: number;
  unit?: Unit;
  taxKey?: TaxKey;
  itemDescription?: string | null;
}
export interface Account {
  accountID?: number;
  accountCode?: number;
  accountName?: string;
}
export interface Item {
  itemID: number;
  itemName?: string;
}
export interface Unit {
  unitID?: number;
  unitName?: string;
}
export interface TaxKey {
  taxKeyID?: number;
  taxKeyName?: string;
}
export interface Adjustments {
  adjustment?: Adjustment[] | null;
}
export interface Adjustment {
  account?: Account;
  amount?: number;
  typeID?: string;
  pctOrAmount?: string;
  taxKey?: TaxKey;
}
export interface ShippingCharge {
  account?: Account;
  amount?: number;
  taxKey?: TaxKey;
}
export interface Taxes {
  tax?: Tax;
}
export interface Tax {
  taxKey?: TaxKey;
  taxName?: string;
  grossAmount?: number;
  netAmount?: number;
  taxAmount?: number;
  account?: Account1;
}
export interface Account1 {
  accountID?: number;
  accountName?: string;
}
export interface Totals {
  grossAmount?: number;
  netAmount?: number;
  qty?: number;
}
