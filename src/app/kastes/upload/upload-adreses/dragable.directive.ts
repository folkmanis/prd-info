import { Directive, input } from '@angular/core';
import { assertNotNull } from 'src/app/library';

@Directive({
  selector: '[appDragable]',
  standalone: true,
  host: {
    draggable: 'true',
    '(dragstart)': 'onDragStart($event)',
  },
})
export class DragableDirective {
  itemContent = input<string>('', { alias: 'appDragable' });

  sourceColumn = input<number | null>();

  onDragStart(event: DragEvent) {
    assertNotNull(event.dataTransfer);
    event.dataTransfer.setData('chipName', this.itemContent());
    const sourceColumn = this.sourceColumn();
    if (sourceColumn) {
      event.dataTransfer.setData('sourceColumn', sourceColumn.toString());
    }
  }
}
