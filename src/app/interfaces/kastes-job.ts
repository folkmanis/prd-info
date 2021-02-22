import { JobBase } from './job-base';
import { Colors, ColorTotals, Veikals } from './kaste';
import { AppHttpResponseBase } from 'src/app/library/http';

export interface KastesJobExtras {
    apjomsPlanned: ColorTotals[];
    totals?: { // darba statistika no pakošanas saraksta
        colorTotals: ColorTotals[];
        apjomiTotals: ApjomiTotals[];
        veikali: number;
    };
    veikali: Veikals[];
}

export interface KastesJob extends JobBase, KastesJobExtras {
    category: 'perforated paper';
}

export interface ApjomiTotals {
    apjoms: number;
    total: number;
}

export type KastesJobPartialKeys = 'category' | 'jobId' | 'name' | 'receivedDate' | 'dueDate';

export type KastesJobPartial = Pick<KastesJob, KastesJobPartialKeys> & { veikaliCount?: number };

export type KastesJobResponse = AppHttpResponseBase<KastesJob>;
