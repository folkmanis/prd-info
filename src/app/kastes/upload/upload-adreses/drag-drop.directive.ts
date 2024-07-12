import { Directive, Output, ElementRef, HostListener, EventEmitter } from '@angular/core';
import { ColumnNames } from '../../services/column-names';

export interface DragData {
  chipName: ColumnNames;
  sourceColumn: number | null;
}

@Directive({
  selector: '[appDragDrop]',
  standalone: true,
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
    this.el.nativeElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
    event.stopPropagation();
    this.el.nativeElement.style.backgroundColor = null;
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const sourceColumn = event.dataTransfer.getData('sourceColumn');
    const data: DragData = {
      sourceColumn: sourceColumn && +sourceColumn,
      chipName: event.dataTransfer.getData('chipName') as ColumnNames,
    };
    this.el.nativeElement.style.backgroundColor = null;
    this.dropEmitter.emit(data);
  }
}
