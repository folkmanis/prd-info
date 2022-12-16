import { Injectable, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const SNACKBAR_TEXT = (txt: string) => `"${txt}" izkopēts!`;

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  constructor(
    private snack: MatSnackBar
  ) { }

  copy(txt: string, copied?: EventEmitter<string> | undefined) {
    const listener = (e: ClipboardEvent) => {
      const clipboard = e.clipboardData;
      clipboard.setData('text', txt);
      e.preventDefault();

      if (copied) { copied.emit(txt); }
      this.snack.open(SNACKBAR_TEXT(txt), 'OK', { duration: 2000 });
    };
    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }

}
