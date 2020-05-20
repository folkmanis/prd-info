import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { TABULA_COLUMNS } from './tabula-columns.class';
import { XmfUploadTabulaDataSource } from './xmf-upload-tabula-data-source';

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.css']
})
export class TabulaComponent implements OnInit {

  constructor(
    private uploadService: UploadService,
  ) { }

  dataSource = new XmfUploadTabulaDataSource(this.uploadService);
  displayedColumns = TABULA_COLUMNS.map(col => col.name);

  ngOnInit(): void {
  }

}
