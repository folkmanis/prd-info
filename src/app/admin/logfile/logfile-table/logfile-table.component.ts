import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { LogRecord } from '../../services/logfile-record';
import { LogfileService } from '../../services/logfile.service';
import { LogTableDatasource } from './log-table-datasource';

@Component({
  selector: 'app-logfile-table',
  templateUrl: './logfile-table.component.html',
  styleUrls: ['./logfile-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LogfileTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table: MatTable<LogRecord>;

  private datasource: LogTableDatasource;

  constructor(
    private service: LogfileService,
  ) { }

  displayedColumns = ['level', 'timestamp', 'info', 'metadata'];
  expandedRecord: LogRecord | null;

  ngOnInit(): void {
    this.datasource = new LogTableDatasource(this.service);
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.datasource;
  }

}

