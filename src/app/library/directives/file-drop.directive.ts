import { Directive, output, signal } from '@angular/core';

@Directive({
  selector: '[appFileDrop]',
  exportAs: 'appFileDrop',
  standalone: true,
  host: {
    '[class.app-file-drop]': 'dragOver()',
    '(dragover)': 'onDragOver($event)',
    '(dragenter)': 'onDragEnter($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
})
export class FileDropDirective {
  dragOver = signal(false);

  filesEmitter = output<FileList>();

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(true);
  }

  onDragEnter(event: DragEvent) {
    event.stopPropagation();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.stopPropagation();
    this.dragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);
    const files: FileList = event.dataTransfer.files;
    if (files.length > 0) {
      this.filesEmitter.emit(files);
    }
  }
}
