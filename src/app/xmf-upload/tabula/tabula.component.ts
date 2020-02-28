import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { XmfUploadProgress } from '../services/xmf-upload.class';
import { TABULA_COLUMNS } from './tabula-columns.class';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-tabula',
  templateUrl: './tabula.component.html',
  styleUrls: ['./tabula.component.css']
})
export class TabulaComponent implements OnInit {

  constructor(
    private uploadService: UploadService,
  ) { }

  dataSource = this.uploadService.statusLog$;
  displayedColumns = TABULA_COLUMNS.map(col => col.name);

  ngOnInit(): void {
  }

}
