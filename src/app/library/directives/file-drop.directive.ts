import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFileDrop]'
})
export class FileDropDirective {

  @Output() filesEmitter = new EventEmitter<FileList>();

  constructor(private el: ElementRef) {

  }
  @HostListener('dragover', ['$event']) onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event: any) {
    event.stopPropagation();
    this.el.nativeElement.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
    event.stopPropagation();
    this.el.nativeElement.style.backgroundColor = null;
  }

  @HostListener('drop', ['$event']) onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.el.nativeElement.style.backgroundColor = null;
    const files: FileList = event.dataTransfer.files;
    if (files.length > 0) {
      this.filesEmitter.emit(files);
    }
  }

}
