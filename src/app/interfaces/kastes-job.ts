import { JobBase } from './job-base';
import { Colors, ColorTotals } from './kaste';
import { AppHttpResponseBase } from 'src/app/library/http';

export interface KastesJob extends JobBase {
    category: 'perforated paper';
    apjomsPlanned: ColorTotals[];
    totals?: { // darba statistika no pakošanas saraksta
        colorTotals: ColorTotals[];
        apjomiTotals: ApjomiTotals[];
        veikali: number;
    };
}

export interface ApjomiTotals {
    apjoms: number;
    total: number;
}

export type KastesJobPartialKeys = 'category' | 'jobId' | 'name' | 'receivedDate' | 'dueDate';

export type KastesJobPartial = Pick<KastesJob, KastesJobPartialKeys> & { veikaliCount?: number; };

export interface KastesJobResponse extends AppHttpResponseBase<KastesJob> {
}
