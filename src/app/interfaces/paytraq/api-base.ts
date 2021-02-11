import { AppHttpResponseBase } from 'src/app/library/http';
import { Clients, Client } from './client';

interface ClientData {
    client: Client;
}

interface ClientsData {
    clients: Clients;
}

export type PaytraqData = ClientData | ClientsData;

export interface PaytraqResponse<T> extends AppHttpResponseBase<T> {
    data?: T;
}

export interface RequestOptions {
    page?: number;
    query?: string;
}
