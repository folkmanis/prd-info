import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { LogRecord } from '../../services/logfile-record';
import { AdminHttpService } from '../../services/admin-http.service';
import { LogTableDatasource } from './log-table-datasource';

@Component({
  selector: 'app-logfile-table',
  templateUrl: './logfile-table.component.html',
  styleUrls: ['./logfile-table.component.css']
})
export class LogfileTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table: MatTable<LogRecord>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private datasource: LogTableDatasource;

  constructor(
    private httpService: AdminHttpService,
  ) { }

  displayedColumns = ['level', 'timestamp', 'info', 'metadata'];

  ngOnInit(): void {
    this.datasource = new LogTableDatasource(this.httpService);
  }

  ngAfterViewInit(): void {
    this.datasource.paginator = this.paginator;
    this.table.dataSource = this.datasource;
  }

}

