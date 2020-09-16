import { ApiBase } from 'src/app/library/http/api-base';
import { ArchiveRecord, SearchQuery, XmfCustomer, ArchiveResp } from 'src/app/interfaces/xmf-search';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpOptions } from 'src/app/library/http/http-options';

export class XmfArchiveApi extends ApiBase<ArchiveRecord> {
    getXmfCustomer(): Observable<string[]> {
        return this.http.get<ArchiveResp>(this.path + 'customers').pipe(
            map(resp => resp.xmfCustomers)
        );
    }

    getSearch(options: HttpOptions): Observable<ArchiveResp> {
        return this.http.get<ArchiveResp>(this.path, options);
    }

}
