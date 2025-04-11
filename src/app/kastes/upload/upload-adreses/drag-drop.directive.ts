import { Directive, output, signal } from '@angular/core';
import { ColumnNames } from '../../services/column-names';
import { notNullOrThrow } from 'src/app/library';

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

    this.dragActive.set(false);

    const dataTransfer = notNullOrThrow(event.dataTransfer);
    const data: DragData = {
      chipName: dataTransfer.getData('chipName') as ColumnNames,
      sourceColumn: null,
    };

    const sourceColumn = dataTransfer.getData('sourceColumn');
    if (sourceColumn) {
      data.sourceColumn = +sourceColumn;
    }

    this.dropEmitter.emit(data);
  }
}
