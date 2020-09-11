import { JobBase } from './job-base';
import { AppHttpResponseBase } from 'src/app/library/http';

export interface ReproJob extends JobBase {
    category: 'repro';
}
