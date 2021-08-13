import { Directive, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileDropDirective } from 'src/app/library/directives/file-drop.directive';

const enum StatusText {
  DEFAULT_TEXT = 'Nomest xlsx failu',
  TOO_MANY = 'Tieši vienu failu!',
  TOO_LARGE = 'Pārsniegts Maksimālais faila izmērs 200kb',
}

@Directive({
  selector: '[appKastesTabulaDrop]',
  exportAs: 'appKastesTabulaDrop',
})
export class KastesTabulaDropDirective extends FileDropDirective {

  @Output('appKastesTabulaDrop') xlsFile: Observable<File | null> = this.filesEmitter.pipe(
    map(filelist => this.onFileDrop(filelist))
  );


  status: string = StatusText.DEFAULT_TEXT;

  private onFileDrop(fileList: FileList): File | null {
    if (fileList.length !== 1) {
      this.status = StatusText.TOO_MANY;
      return null;
    }
    const file = fileList[0];
    if (file.size > 200 * 1024) {
      this.status = StatusText.TOO_LARGE;
      return null;
    }
    if (file.name.endsWith('.xls') || file.name.endsWith('xlsx')) {
      this.status = this.fileStatus(file);
      return file;
    }
    this.status = StatusText.DEFAULT_TEXT;
  }

  private fileStatus = (file: File) => `${file.name} / ${file.size} bytes`;

}
