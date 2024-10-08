import { Directive, output, signal } from '@angular/core';
import { ColumnNames } from '../../services/column-names';

export interface DragData {
  chipName: ColumnNames;
  sourceColumn: number | null;
}

@Directive({
  selector: '[appDragDrop]',
  standalone: true,
  host: {
    class: 'app-drag-drop',
    '[class.app-drag-drop-active]': 'dragActive()',
    '(dragover)': 'onDragOver($event)',
    '(dragenter)': 'onDragEnter($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
})
export class DragDropDirective {
  dropEmitter = output<DragData>();

  dragActive = signal(false);

  onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragEnter(event: any) {
    event.stopPropagation();
    this.dragActive.set(true);
  }

  onDragLeave(event: any) {
    event.stopPropagation();
    this.dragActive.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const sourceColumn = event.dataTransfer.getData('sourceColumn');
    const data: DragData = {
      sourceColumn: sourceColumn && +sourceColumn,
      chipName: event.dataTransfer.getData('chipName') as ColumnNames,
    };
    this.dragActive.set(false);
    this.dropEmitter.emit(data);
  }
}
