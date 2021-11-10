import { AppHttpResponseBase } from 'src/app/library/http/app-http-response-base';

import { ArchiveRecord } from './archive-record';
import { ArchiveFacet } from './archive-facet';
import { XmfCustomer } from './xmf-customer';


export interface ArchiveResp extends AppHttpResponseBase<ArchiveRecord> {
    count?: number;
    facet?: ArchiveFacet;
    data: Partial<ArchiveRecord[]>;
}
