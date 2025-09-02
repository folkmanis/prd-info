import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ShortenTextPipe } from 'prd-cdk';
import { ViewSizeDirective } from 'src/app/library/view-size';
import { configuration } from 'src/app/services/config.provider';
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

  private levelsMap = configuration('system', 'logLevels');
  protected logLevels = computed(() => {
    return this.levelsMap().reduce(
      (acc, curr) => {
        acc[curr[0]] = curr[1];
        return acc;
      },
      {} as Record<number, string>,
    );
  });

  log = input<LogRecord[] | undefined>();
}
