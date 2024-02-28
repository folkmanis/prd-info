import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDragable]',
  standalone: true
})
export class DragableDirective {

  @Input('appDragable') itemContent: string;

  @Input() sourceColumn: number | null = null;

  constructor(el: ElementRef) {
    el.nativeElement.draggable = true;
  }

  @HostListener('dragstart', ['$event']) onDragStart(event: DragEvent) {
    event.dataTransfer.setData('chipName', this.itemContent);
    event.dataTransfer.setData('sourceColumn', this.sourceColumn?.toString());
  }

}
