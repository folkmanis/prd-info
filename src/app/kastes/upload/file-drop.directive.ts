import { Directive, HostListener, ElementRef, EventEmitter, Output, inject } from '@angular/core';

@Directive({
  selector: '[appFileDrop]',
  standalone: true,
})
export class FileDropDirective {
  private element = inject(ElementRef).nativeElement;

  @Output('appFileDrop') filesEmitter = new EventEmitter<FileList>();

  @HostListener('dragover', ['$event']) onDragOver(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event: Event) {
    event.stopPropagation();
    this.element.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: Event) {
    event.stopPropagation();
    this.element.style.backgroundColor = null;
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.element.style.backgroundColor = null;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.filesEmitter.emit(files);
    }
  }
}
