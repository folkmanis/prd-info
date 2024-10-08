import { Directive, input } from '@angular/core';

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
    event.dataTransfer.setData('chipName', this.itemContent());
    event.dataTransfer.setData('sourceColumn', this.sourceColumn()?.toString());
  }
}
