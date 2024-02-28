import { Colors } from './kastes-colors';

export type AddressPackage = Record<Colors, number> & {
    address: string;
    addressId: number;
    boxSequence: number;
    completed: boolean;
    documentId: string;
    hasLabel: boolean;
    total: number;
};