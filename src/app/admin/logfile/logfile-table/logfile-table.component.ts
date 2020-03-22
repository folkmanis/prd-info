import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTable } from '@angular/material/table';
import { LogRecord } from '../../services/logfile-record';
import { AdminHttpService } from '../../services/admin-http.service';
import { LogfileService } from '../../services/logfile.service';
import { LogTableDatasource } from './log-table-datasource';

@Component({
  selector: 'app-logfile-table',
  templateUrl: './logfile-table.component.html',
  styleUrls: ['./logfile-table.component.css']
})
export class LogfileTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table: MatTable<LogRecord>;

  private datasource: LogTableDatasource;

  constructor(
    private service: LogfileService,
  ) { }

  displayedColumns = ['level', 'timestamp', 'info', 'metadata'];

  ngOnInit(): void {
    this.datasource = new LogTableDatasource(this.service);
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.datasource;
  }

}

