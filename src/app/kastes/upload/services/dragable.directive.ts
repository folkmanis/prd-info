import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appDragable]',
    standalone: true
})
export class DragableDirective {
  @Input('appDragable') itemContent: string;
  @Input() dragSource: string;

  constructor(el: ElementRef) {
    el.nativeElement.draggable = true;
  }

  @HostListener('dragstart', ['$event']) onDragStart(event: DragEvent) {
    event.dataTransfer.setData('text', this.itemContent);
    if (this.dragSource) {
      event.dataTransfer.setData('source', this.dragSource);
    }
  }

}
