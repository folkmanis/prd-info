import { animate, state, style, transition, trigger } from '@angular/animations';
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
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [MatTableModule, JsonPipe, DatePipe, ShortenTextPipe, ViewSizeDirective],
})
export class LogfileTableComponent {
  readonly displayedColumns = ['level', 'timestamp', 'info', 'metadata'];

  expandedRecord: LogRecord | null;

  log = input<LogRecord[]>([]);
}
