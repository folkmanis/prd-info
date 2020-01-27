import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTable } from '@angular/material/table';

import { TabulaDatasource } from './tabula-datasource';
import { PasutijumiService } from '../services/pasutijumi.service';
import { Pasutijums } from '../services/pasutijums';

@Component({
  selector: 'app-pasutijumi',
  templateUrl: './pasutijumi.component.html',
  styleUrls: ['./pasutijumi.component.css']
})
export class PasutijumiComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable, { static: false }) table: MatTable<Pasutijums>;
  dataSource: TabulaDatasource;
  displayedColumns = ['name', 'deleted', 'created'];

  constructor(
    private pasutijumiService: PasutijumiService,
  ) {
    this.dataSource = new TabulaDatasource(this.pasutijumiService);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.table.dataSource = this.dataSource;
  }

}
