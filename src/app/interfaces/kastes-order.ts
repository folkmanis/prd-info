import { AppHttpResponseBase } from 'src/app/library/http';
import { Colors, ColorTotals } from './kaste';
import { Job } from './job';

export type KastesJob = Job & {
    category: 'perforated paper';
    isLocked: boolean;
    apjomsPlanned: ColorTotals[];
    totals?: { // darba statistika no pakošanas saraksta
        colorTotals: ColorTotals[];
        apjomiTotals: ApjomiTotals[];
        veikali: number;
    };
};

export interface ApjomiTotals {
    apjoms: number;
    total: number;
}

export type KastesJobPartial = Pick<KastesJob, 'jobId'  | 'name' | 'receivedDate' | 'isLocked' | 'dueDate'>;

export interface OrdersResponse extends AppHttpResponseBase<KastesJob> {
}
