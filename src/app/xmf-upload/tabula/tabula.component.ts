import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { TABULA_COLUMNS } from './tabula-columns.class';
import { XmfUploadTabulaDataSource } from './xmf-upload-tabula-data-source';

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.scss']
})
export class TabulaComponent implements OnInit {

  dataSource = new XmfUploadTabulaDataSource(this.uploadService);
  displayedColumns = TABULA_COLUMNS.map(col => col.name);

  constructor(
    private uploadService: UploadService,
  ) { }

  ngOnInit(): void {
  }

}
