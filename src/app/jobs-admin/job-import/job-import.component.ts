import { Component, OnInit } from '@angular/core';

import { JobImportService } from './services/job-import.service';

@Component({
  selector: 'app-job-import',
  templateUrl: './job-import.component.html',
  styleUrls: ['./job-import.component.css']
})
export class JobImportComponent implements OnInit {

  constructor(
    private service: JobImportService
  ) { }

  ngOnInit(): void {
  }

  onFileDrop(fileList: FileList): void {
    const file = fileList.item(0);
    if (file.name.endsWith('.csv') && fileList.length === 1) {
      this.service.parseCsvFile(file).subscribe();
    }
  }

}
