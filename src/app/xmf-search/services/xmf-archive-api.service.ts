import { Injectable, Inject } from '@angular/core';
import { ApiBase } from 'src/app/library/http/api-base';
import { ArchiveRecord, SearchQuery, ArchiveFacet } from '../interfaces';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { HttpOptions } from 'src/app/library/http/http-options';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';
import { HttpClient } from '@angular/common/http';
import { ClassTransformer } from 'class-transformer';

@Injectable({
    providedIn: 'root'
})
export class XmfArchiveApiService extends ApiBase<ArchiveRecord> {

    constructor(
        @Inject(APP_PARAMS) params: AppParams,
        http: HttpClient,
        private transformer: ClassTransformer,
    ) {
        super(http, params.apiPath + 'xmf-search/');
    }


    private queryStr = (query: SearchQuery, start?: number, limit?: number) => ({
        query: query.searialize(),
        start,
        limit,
    });

    getXmfCustomer(): Observable<string[]> {
        return this.http.get<string[]>(this.path + 'customers');
    }

    getArchive(query: SearchQuery, start?: number, limit?: number): Observable<ArchiveRecord[]> {
        return this.http.get<Record<string, any>[]>(
            this.path,
            new HttpOptions(this.queryStr(query, start, limit))
        ).pipe(
            map(data => this.transformer.plainToInstance(ArchiveRecord, data))
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
