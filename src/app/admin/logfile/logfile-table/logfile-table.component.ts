import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ShortenTextPipe } from 'prd-cdk';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { LOG_LEVELS } from '../services/log-levels';
import { LogRecord } from '../services/logfile-record';

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

  protected logLevels = LOG_LEVELS.reduce(
    (acc, curr) => {
      acc[curr[0]] = curr[1];
      return acc;
    },
    {} as Record<number, string>,
  );

  log = input<LogRecord[] | undefined>();
}
