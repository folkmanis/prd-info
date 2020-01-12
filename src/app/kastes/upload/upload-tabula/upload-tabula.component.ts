import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UploadTabulaDataSource } from './upload-tabula-datasource';
import { UploadService } from '../upload.service';
import { MatTable } from '@angular/material/table';
import { AdreseBox, AdrBoxTotals } from '../adrese-box';
import { PreferencesService, Preferences } from '../../services/preferences.service';

@Component({
  selector: 'app-upload-tabula',
  templateUrl: './upload-tabula.component.html',
  styleUrls: ['./upload-tabula.component.css']
})
export class UploadTabulaComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable, { static: false }) table: MatTable<AdreseBox>;

  boxColors = ['yellow', 'rose', 'white'];
  displayedColumns = ['kods', 'adrese', 'editor'];
  headColumns = ['kods', 'adrese', ...this.boxColors, 'total'];

  widths = {
    kods: '50px',
    adrese: '500px',
    yellow: '50px',
    rose: '50px',
    white: '50px',
    total: '50px',
  };
  dataSource: UploadTabulaDataSource;
  totals: AdrBoxTotals;
  prefs: Preferences = new Preferences();
  edit: boolean[] = [];
  editActive = false;

  constructor(
    private uploadService: UploadService,
    private preferencesService: PreferencesService,
  ) { }

  ngOnInit() {
    this.preferencesService.getPreferences().subscribe((pr) => this.prefs = pr);
    this.dataSource = new UploadTabulaDataSource(this.uploadService);
    this.totals = this.uploadService.adresesBoxTotals;

  }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;
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
