import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FilesizePipe } from 'prd-cdk';
import { XmfUploadProgress } from '../interfaces/xmf-upload-progress';

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, FilesizePipe, DatePipe],
})
export class TabulaComponent {
  history = input<XmfUploadProgress[] | null>([]);

  displayedColumns = ['started', 'fileName', 'fileSize', 'count.processed', 'count.upserted', 'count.modified'];
}
