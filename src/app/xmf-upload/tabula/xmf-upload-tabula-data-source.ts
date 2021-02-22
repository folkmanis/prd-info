import { DataSource } from '@angular/cdk/table';
import { merge, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UploadService } from '../services/upload.service';
import { EMPTY_PROGRESS, XmfUploadProgressTable } from '../services/xmf-upload.class';

export class XmfUploadTabulaDataSource implements DataSource<XmfUploadProgressTable> {

    private data: XmfUploadProgressTable[];
    private initial$ = this.service.statusLog$.pipe(
        tap(log => this.data = log)
    );

    private updates$: Observable<XmfUploadProgressTable[]> = this.service.uploadProgressChanges$.pipe(
        map(upd => ({ ...EMPTY_PROGRESS, ...upd })),
        map(upd => this.updateTable(upd)),
    );

    constructor(
        private service: UploadService
    ) { }

    connect(): Observable<XmfUploadProgressTable[]> {
        return merge(this.initial$, this.updates$);
    }

    disconnect() {
    }

    private updateTable(upd: XmfUploadProgressTable): XmfUploadProgressTable[] {
        const rec = this.data.findIndex(val => val._id === upd._id);
        if (rec === -1) {
            this.data.unshift(upd);
        } else {
            this.data[rec] = upd;
        }
        return this.data;
    }

}
