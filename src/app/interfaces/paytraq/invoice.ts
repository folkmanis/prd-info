export interface Invoice {
    Sale: Sale;
}
export interface Sale {
    Header: Header;
    LineItems: LineItems;
    Adjustments: Adjustments;
    ShippingCharge: ShippingCharge;
    Taxes: Taxes;
    Totals: Totals;
}
export interface Header {
    Document: Document;
    SaleType: string;
    Operation: string;
    Total: string;
    AmountDue: string;
    DueNoticeEnabled: string;
    Currency: string;
    BalanceCurrency: string;
    CurrencyRate: string;
    TaxBasis: string;
    IncludeTax: string;
    UseOverpayment: string;
    DateDue: string;
    DateApproved: string;
    Discount: string;
    Signature: string;
    InvoicePeriod: InvoicePeriod;
    PayTerm: PayTerm;
    AccountID: string;
    ShippingData: ShippingData;
    TimeStamps: TimeStamps;
}
export interface Document {
    DocumentID: string;
    DocumentDate: string;
    DocumentRef: string;
    DocumentType: string;
    DocumentStatus: string;
    Client: Client;
}
export interface Client {
    ClientID: string;
    ClientName: string;
}
export interface InvoicePeriod {
    PeriodType: string;
}
export interface PayTerm {
    PayTermType: string;
    PayTermDays: string;
}
export interface ShippingData {
    ShippingType: string;
    Warehouse: Warehouse;
    LoadingArea: LoadingArea;
    Shipper: Shipper;
    ShippingAddress: ShippingAddress;
}
export interface Warehouse {
    WarehouseID: string;
    WarehouseName: string;
}
export interface LoadingArea {
    LoadingAreaID: string;
    LoadingAreaName: string;
    LoadingAreaAddress: LoadingAreaAddress;
}
export interface LoadingAreaAddress {
    Address: string;
    Zip: string;
    Country: string;
}
export interface Shipper {
    ShipperID: string;
    ShipperName: string;
    ShipperRegNumber: string;
    ShipperVehicle: string;
    ShipperDriver: string;
}
export interface ShippingAddress {
    AddressID: string;
    ShipTo: string;
    Address: string;
    Zip: string;
    Country: string;
}
export interface TimeStamps {
    Created: string;
    Updated: string;
}
export interface LineItems {
    LineItem?: (LineItemEntity)[] | null;
}
export interface LineItemEntity {
    Account: Account;
    Item: Item;
    Description: string;
    ItemDescription: string;
    Qty: string;
    Price: string;
    LineDiscount: string;
    LineTotal: string;
    Unit: Unit;
    TaxKey: TaxKey;
}
export interface Account {
    AccountID: string;
    AccountCode: string;
    AccountName: string;
}
export interface Item {
    ItemID: string;
    ItemName: string;
}
export interface Unit {
    UnitID: string;
    UnitName: string;
}
export interface TaxKey {
    TaxKeyID: string;
    TaxKeyName: string;
}
export interface Adjustments {
    Adjustment: Adjustment;
}
export interface Adjustment {
    Account: Account;
    Amount: string;
    TypeID: string;
    PctOrAmount: string;
    TaxKey: TaxKey;
}
export interface ShippingCharge {
    Account: Account;
    Amount: string;
    TaxKey: TaxKey;
}
export interface Taxes {
    Tax: Tax;
}
export interface Tax {
    TaxKey: TaxKey;
    TaxName: string;
    GrossAmount: string;
    NetAmount: string;
    TaxAmount: string;
    Account: Account1;
}
export interface Account1 {
    AccountID: string;
    AccountName: string;
}
export interface Totals {
    GrossAmount: string;
    NetAmount: string;
    Qty: string;
}
