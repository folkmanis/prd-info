import { animate, state, style, transition, trigger } from '@angular/animations';
import { Input, AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LogRecord } from '../../services/logfile-record';
import { ReplaySubject } from 'rxjs';
import { ShortenTextPipe } from '../../../library/common/shorten-text.pipe';
import { NgIf, JsonPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

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
    standalone: true,
    imports: [
        MatTableModule,
        NgIf,
        JsonPipe,
        DatePipe,
        ShortenTextPipe,
    ],
})
export class LogfileTableComponent {

  readonly displayedColumns = ['level', 'timestamp', 'info', 'metadata'];

  datasource$ = new ReplaySubject<LogRecord[]>(1);

  expandedRecord: LogRecord | null;

  @Input() set log(value: LogRecord[] | null) {
    if (value) {
      this.datasource$.next(value);
    }
  }


}

