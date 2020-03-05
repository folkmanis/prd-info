import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { DataSource } from '@angular/cdk/table';
import { XmfUploadProgress, XmfUploadProgressTable, EMPTY_PROGRESS } from '../services/xmf-upload.class';
import { TABULA_COLUMNS } from './tabula-columns.class';
import { Observable, merge, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.css']
})
export class TabulaComponent implements OnInit {

  constructor(
    private uploadService: UploadService,
  ) { }

  dataSource = new XmfUploadTabulaDataSource(this.uploadService);
  displayedColumns = TABULA_COLUMNS.map(col => col.name);

  ngOnInit(): void {
  }

}

class XmfUploadTabulaDataSource implements DataSource<XmfUploadProgressTable> {

  private data: XmfUploadProgressTable[];
  constructor(
    private service: UploadService
  ) { }

  private initial$ = this.service.statusLog$.pipe(
    tap(log => this.data = log)
  );

  private updates$: Observable<XmfUploadProgressTable[]> = this.service.uploadProgressChanges$.pipe(
    map(upd => ({ ...EMPTY_PROGRESS, ...upd })),
    map(upd => this.updateTable(upd)),
  );

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