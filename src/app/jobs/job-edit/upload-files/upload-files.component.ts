import { Component, Input, Output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFilesComponent implements OnInit {
  @Input('files') set files(val: File[]) {
    /* Ignorē folderus un tukšus datus */
    if (!val?.filter(file => file.size).length) { return; }
    this.files$.next(val);
  }

  files$ = new ReplaySubject<File[]>(1);
  readonly columnsToDisplay = [
    'name',
    'lastModifiedDate',
    'size',
    'type',
  ];

  constructor() { }

  ngOnInit(): void {
    this.files$.subscribe(console.log);
  }

}
