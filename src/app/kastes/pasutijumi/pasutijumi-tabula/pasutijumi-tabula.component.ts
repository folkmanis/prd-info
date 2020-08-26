import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { TabulaDatasource } from './tabula-datasource';
import { PasutijumiService } from '../../services/pasutijumi.service';
import { KastesOrderPartial } from 'src/app/interfaces';


@Component({
  selector: 'app-pasutijumi-tabula',
  templateUrl: './pasutijumi-tabula.component.html',
  styleUrls: ['./pasutijumi-tabula.component.css']
})
export class PasutijumiTabulaComponent implements OnInit {

  dataSource: TabulaDatasource = new TabulaDatasource(this.pasutijumiService);
  displayedColumns = ['name', 'deleted', 'created'];


  constructor(
    private pasutijumiService: PasutijumiService,
  ) { }

  ngOnInit(): void {
  }

  onCheckDeleted(pas: KastesOrderPartial, ev: MatCheckboxChange) {
    this.dataSource.updatePas({ _id: pas._id, deleted: ev.checked }).subscribe();
  }

}
