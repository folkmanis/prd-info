import { Directive, Output, ElementRef, HostListener, EventEmitter } from '@angular/core';
import { ColumnNames } from './chips.service';

export interface DragData {
  text: ColumnNames;
  source: string;
}

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  @Output() private dropEmitter = new EventEmitter<DragData>();

  constructor(private el: ElementRef) {
    el.nativeElement.draggable = true;
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

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const data: DragData = {
      source: event.dataTransfer.getData('source'),
      text: event.dataTransfer.getData('text') as ColumnNames,
    };
    this.el.nativeElement.style.backgroundColor = null;
    this.dropEmitter.emit(data);
  }
}
