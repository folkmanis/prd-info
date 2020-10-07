import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UploadTabulaDataSource } from './upload-tabula-datasource';
import { UploadService } from '../services/upload.service';
import { MatTable } from '@angular/material/table';
import { AdreseBox, AdrBoxTotals } from '../services/adrese-box';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';

@Component({
  selector: 'app-upload-tabula',
  templateUrl: './upload-tabula.component.html',
  styleUrls: ['./upload-tabula.component.scss']
})
export class UploadTabulaComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table: MatTable<AdreseBox>;

  boxColors = ['yellow', 'rose', 'white'];
  displayedColumns = ['kods', 'adrese', 'editor'];
  headColumns = ['kods', 'adrese', ...this.boxColors, 'total'];

  dataSource: UploadTabulaDataSource;
  totals: AdrBoxTotals;
  prefs$ = this.kastesPreferencesService.preferences$;
  edit: boolean[] = [];
  editActive = false;

  constructor(
    private uploadService: UploadService,
    private kastesPreferencesService: KastesPreferencesService,
  ) { }

  ngOnInit() {
    this.dataSource = new UploadTabulaDataSource(this.uploadService);
    this.totals = this.uploadService.adresesBoxTotals;
  }

  ngAfterViewInit() {
  }

  onClickEdit(adrB: AdreseBox) {
    if (this.editActive) { return; } // Ja labošana jau notiek, tad neko nedarīt
    this.editActive = true;
    this.edit[adrB.kods] = true;
  }

  onEditFinish(ev: boolean, adrB: AdreseBox) {
    const idx = this.dataSource.indexOf(adrB);
    this.edit[adrB.kods] = false;
    this.editActive = false;
    if (ev) {
      this.totals = this.uploadService.adresesBoxTotals;
    }
  }

}
