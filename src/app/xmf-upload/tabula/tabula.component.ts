import { Input, Component, ChangeDetectionStrategy } from '@angular/core';
import { XmfUploadProgress } from '../interfaces/xmf-upload-progress';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabulaComponent {

  dataSource$ = new ReplaySubject<XmfUploadProgress[]>(1);

  @Input() set history(value: XmfUploadProgress[]) {
    if (value instanceof Array) {
      this.dataSource$.next(value);
    }
  }

  displayedColumns = [
    'finished',
    'fileName',
    'fileSize',
    'count.processed',
    'count.upserted',
    'count.modified',
  ];

  constructor(
  ) { }


}
