import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator } from '@angular/material/paginator';
import { LogRecord } from '../../services/logfile-record';
import { LogfileService } from '../../services/logfile.service';

@Component({
  selector: 'app-logfile-table',
  templateUrl: './logfile-table.component.html',
  styleUrls: ['./logfile-table.component.css']
})
export class LogfileTableComponent implements OnInit, AfterViewInit {
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
   public service: LogfileService,
  ) { }

  displayedColumns=['level', 'timestamp', 'info', 'metadata']

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.service.paginator = this.paginator;
  }

}

