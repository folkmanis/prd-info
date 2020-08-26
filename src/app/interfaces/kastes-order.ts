import { AppHttpResponseBase } from 'src/app/library/http';
import { Colors, ColorTotals } from './kaste';

export interface ApjomiTotals {
    apjoms: number;
    total: number;
}

export interface KastesOrder {
    _id: string;
    name: string;
    deleted: boolean;
    created: Date;
    totals: {
        colorTotals: ColorTotals[];
        apjomiTotals: ApjomiTotals[];
        veikali: number;
    };
}

export type KastesOrderPartial = Pick<KastesOrder, '_id' | 'name' | 'created' | 'deleted'>;

export interface OrdersResponse extends AppHttpResponseBase<KastesOrder> {
    deleted?: CleanupResponse;
}

export interface CleanupResponse {
    veikali: number;
    orders: number;
    ids: string[];
}
