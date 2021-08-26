import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LogRecord } from '../../services/logfile-record';
import { LogfileService } from '../../services/logfile.service';

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
})
export class LogfileTableComponent implements OnInit, AfterViewInit {

  displayedColumns = ['level', 'timestamp', 'info', 'metadata'];
  expandedRecord: LogRecord | null;
  datasource$ = this.logService.log$;

  constructor(
    private logService: LogfileService,
  ) { }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

}

