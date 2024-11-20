import { Input, Component, ChangeDetectionStrategy } from '@angular/core';
import { XmfUploadProgress } from '../interfaces/xmf-upload-progress';
import { ReplaySubject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { FilesizePipe } from 'prd-cdk';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-tabula',
    templateUrl: './tabula.component.html',
    styleUrls: ['./tabula.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatTableModule, FilesizePipe, DatePipe]
})
export class TabulaComponent {
  dataSource$ = new ReplaySubject<XmfUploadProgress[]>(1);

  @Input() set history(value: XmfUploadProgress[]) {
    if (Array.isArray(value)) {
      this.dataSource$.next(value);
    }
  }

  displayedColumns = ['started', 'fileName', 'fileSize', 'count.processed', 'count.upserted', 'count.modified'];
}
