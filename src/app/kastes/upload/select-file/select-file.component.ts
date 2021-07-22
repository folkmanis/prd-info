import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const enum StatusText {
  DEFAULT_TEXT = 'Atlasīt xlsx failu',
  TOO_MANY = 'Tieši vienu failu!',
  TOO_LARGE = 'Pārsniegts Maksimālais faila izmērs 200kb',
}

@Component({
  selector: 'app-select-file',
  templateUrl: './select-file.component.html',
  styleUrls: ['./select-file.component.scss']
})
export class SelectFileComponent implements OnInit {

  @Output() xlsFile: EventEmitter<File | null> = new EventEmitter();

  readonly status$ = new BehaviorSubject<string>(StatusText.DEFAULT_TEXT);

  constructor() { }

  ngOnInit(): void {
  }

  onFileDrop(fileList: FileList) {
    if (fileList.length !== 1) {
      this.status$.next(StatusText.TOO_MANY);
      return;
    }
    if (fileList[0].size > 200 * 1024) {
      this.status$.next(StatusText.TOO_LARGE);
      return;
    }
    if (fileList[0].name.endsWith('.xls') || fileList[0].name.endsWith('xlsx')) {
      this.status$.next(this.fileStatus(fileList[0]));
      this.xlsFile.emit(fileList[0]);
      return;
    }
  }

  private fileStatus = (file: File) => `${file.name} / ${file.size} bytes / ${file.type}`;

}
