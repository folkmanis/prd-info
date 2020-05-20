import { Component, OnInit, EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, of as observableOf, merge, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UploadService } from '../services/upload.service';
import { UploadRow } from '../services/upload-row';
import { AdreseBox } from '../services/adrese-box';

export class UploadTabulaDataSource extends DataSource<AdreseBox> {
    data: AdreseBox[] = [];

    constructor(
        private uploadService: UploadService,
    ) {
        super();
    }

    /**
     * Connect this data source to the table. The table will only update when
     * the returned stream emits new items.
     * @returns A stream of the items to be rendered.
     */
    connect(): Observable<AdreseBox[]> {
        return this.uploadService.adresesBox$.pipe(
            map((adrB) => {
                return adrB.map(ab => {
                    ab.total = ab.totals.yellow + ab.totals.rose + ab.totals.white;
                    return ab;
                });
            }),
            tap((adrB) => this.data = adrB));
    }

    indexOf(adrB: AdreseBox) {
        return this.data.indexOf(adrB);
    }
    /**
     *  Called when the table is being destroyed. Use this function, to clean up
     * any open connections or free any held resources that were set up during connect.
     */
    disconnect() { }

}
