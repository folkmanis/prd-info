import { Input, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { XmfUploadService } from '../services/xmf-upload.service';
import { XmfUploadHistory } from '../interfaces/xmf-upload-history';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabulaComponent implements OnInit {

  dataSource$ = new ReplaySubject<XmfUploadHistory[]>(1);

  @Input() set history(value: XmfUploadHistory[]) {
    if (value instanceof Array) {
      this.dataSource$.next(value);
    }
  }

  displayedColumns = [
    // 'started',
    'finished',
    'fileName',
    'fileSize',
    'count.processed',
    'count.upserted',
    'count.modified',
  ];

  constructor(
    private uploadService: XmfUploadService,
  ) { }

  ngOnInit(): void {
  }

}
