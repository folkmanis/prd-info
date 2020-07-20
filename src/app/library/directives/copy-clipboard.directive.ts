import { Directive, Input, Output, EventEmitter, HostListener, ElementRef, HostBinding } from '@angular/core';
import { ClipboardService } from '../services/clipboard.service';

@Directive({
  selector: '[appCopyClipboard]',
})
export class CopyClipboardDirective {

  /** If input value not provided, uses HTMLElement.innerText */
  @Input('appCopyClipboard')
  payload: string;

  @Output()
  copied: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('class.app-copy-clipboard')
  appCopyClipboardClass = true;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    const txt: string = this.payload || (this.el.nativeElement as HTMLElement).innerText.trim();
    this.clipboardService.copy(txt, this.copied);
  }

  constructor(
    private clipboardService: ClipboardService,
    private el: ElementRef,
  ) { }

}
