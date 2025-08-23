import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ShortenTextPipe } from 'prd-cdk';
import { LogRecord } from '../../services/logfile-record';
import { ViewSizeDirective } from 'src/app/library/view-size';

@Component({
  selector: 'app-logfile-table',
  templateUrl: './logfile-table.component.html',
  styleUrls: ['./logfile-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, JsonPipe, DatePipe, ShortenTextPipe, ViewSizeDirective],
})
export class LogfileTableComponent {
  protected readonly displayedColumns = ['level', 'timestamp', 'info', 'metadata'];

  protected expandedRecord: LogRecord | null = null;

  log = input<LogRecord[]>([]);
}
