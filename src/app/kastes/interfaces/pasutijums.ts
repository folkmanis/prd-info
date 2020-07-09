import { AppHttpResponseBase } from 'src/app/library/http';

export interface Pasutijums {
    _id: string;
    name: string;
    deleted: boolean;
    created: Date;

}

export interface OrdersResponse extends AppHttpResponseBase<Pasutijums> {
    deleted?: CleanupResponse;
}

export interface CleanupResponse {
    veikali: number;
    orders: number;
    ids: string[];
}
