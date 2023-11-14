import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appFileDrop]',
  exportAs: 'appFileDrop',
  standalone: true,
})
export class FileDropDirective {
  private _dragOver = false;

  @Output() filesEmitter = new EventEmitter<FileList>();

  @HostBinding('class.app-file-drop')
  get dragOver() {
    return this._dragOver;
  }
  set dragOver(value: boolean) {
    this._dragOver = !!value;
  }

  @HostListener('dragover', ['$event']) onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event: DragEvent) {
    event.stopPropagation();
    this.dragOver = true;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.stopPropagation();
    this.dragOver = false;
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
    const files: FileList = event.dataTransfer.files;
    if (files.length > 0) {
      this.filesEmitter.emit(files);
    }
  }
}
