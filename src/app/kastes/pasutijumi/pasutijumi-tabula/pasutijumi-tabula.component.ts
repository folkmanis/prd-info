import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { TabulaDatasource } from './tabula-datasource';
import { PasutijumiService } from '../../services/pasutijumi.service';
import { KastesJobPartial } from 'src/app/interfaces';


@Component({
  selector: 'app-pasutijumi-tabula',
  templateUrl: './pasutijumi-tabula.component.html',
  styleUrls: ['./pasutijumi-tabula.component.css']
})
export class PasutijumiTabulaComponent implements OnInit {

  dataSource: TabulaDatasource = new TabulaDatasource(this.pasutijumiService);
  displayedColumns = ['name', 'receivedDate', 'dueDate'];


  constructor(
    private pasutijumiService: PasutijumiService,
  ) { }

  ngOnInit(): void {
  }

}
