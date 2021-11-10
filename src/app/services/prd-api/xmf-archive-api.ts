import { ApiBase } from 'src/app/library/http/api-base';
import { ArchiveRecord, SearchQuery, XmfCustomer, ArchiveResp, ArchiveFacet } from 'src/app/interfaces/xmf-search';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { HttpOptions } from 'src/app/library/http/http-options';

export class XmfArchiveApi extends ApiBase<ArchiveRecord> {

    private queryStr = (query: SearchQuery, start?: number, limit?: number) => ({
        query: JSON.stringify(query),
        start,
        limit,
    });

    getXmfCustomer(): Observable<string[]> {
        return this.http.get<string[]>(this.path + 'customers');
    }

    getArchive(query: SearchQuery, start?: number, limit?: number): Observable<ArchiveRecord[]> {
        return this.http.get<ArchiveRecord[]>(
            this.path,
            new HttpOptions(this.queryStr(query, start, limit))
        );
    }

    getCount(query: SearchQuery): Observable<number> {
        return this.http.get<{ count: number; }>(
            this.path + 'count',
            new HttpOptions(this.queryStr(query)),
        ).pipe(
            pluck('count'),
        );
    }

    getFacet(query: SearchQuery): Observable<ArchiveFacet> {
        return this.http.get<ArchiveFacet>(
            this.path + 'facet',
            new HttpOptions(this.queryStr(query)),
        );
    }


}
