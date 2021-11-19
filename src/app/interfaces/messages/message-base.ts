import { Modules } from '../system-preferences';

export interface MessageBase {
    _id: string;
    timestamp: Date;
    seen: boolean;
    deleted: boolean;
    readonly module: Modules;
}

