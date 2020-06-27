import { Directive, Input, Output, EventEmitter, HostListener, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[appCopyClipboard]',
})
export class CopyClipboardDirective {

  @Input('appCopyClipboard')
  payload: string;

  @Output()
  copied: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('class.app-copy-clipboard')
  appCopyClipboardClass = true;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.payload) {
      return;
    }

    const listener = (e: ClipboardEvent) => {
      const clipboard = e.clipboardData;
      clipboard.setData('text', this.payload.toString());
      e.preventDefault();

      this.copied.emit(this.payload);
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }

  constructor() { }

}
