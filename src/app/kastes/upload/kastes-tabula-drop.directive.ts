import { Directive, inject, signal } from '@angular/core';
import { outputFromObservable, outputToObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FileDropDirective } from 'src/app/library/directives/file-drop.directive';

const enum StatusText {
  DEFAULT_TEXT = 'Nomest xlsx failu',
  TOO_MANY = 'Tieši vienu failu!',
  TOO_LARGE = 'Pārsniegts Maksimālais faila izmērs 200kb',
}

@Directive({
  selector: '[appKastesTabulaDrop]',
  exportAs: 'appKastesTabulaDrop',
  standalone: true,
  hostDirectives: [FileDropDirective]
})
export class KastesTabulaDropDirective extends FileDropDirective {

  private fileDropDirective = inject(FileDropDirective, { self: true });

  private fileDrop$ = outputToObservable(this.fileDropDirective.filesEmitter)
    .pipe(
      map(filelist => this.onFileDrop(filelist))
    );

  xlsFile = outputFromObservable(this.fileDrop$);


  status = signal(StatusText.DEFAULT_TEXT as string);

  private onFileDrop(fileList: FileList): File | null {
    if (fileList.length !== 1) {
      this.status.set(StatusText.TOO_MANY);
      return null;
    }
    const file = fileList[0];
    if (file.size > 200 * 1024) {
      this.status.set(StatusText.TOO_LARGE);
      return null;
    }
    if (file.name.endsWith('.xls') || file.name.endsWith('xlsx')) {
      this.status.set(this.fileStatus(file));
      return file;
    }
    this.status.set(StatusText.DEFAULT_TEXT);
  }

  private fileStatus = (file: File) => `${file.name} / ${file.size} bytes`;

}
