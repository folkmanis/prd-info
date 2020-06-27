import { Directive, Input, Output, EventEmitter, HostListener, ElementRef, HostBinding } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      this.snack.open(`"${this.payload}" izkopēts!`, 'OK', { duration: 2000 });

    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }

  constructor(
    private snack: MatSnackBar,
  ) { }

}
