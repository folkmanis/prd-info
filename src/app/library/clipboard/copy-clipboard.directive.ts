import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { Directive, inject, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const SNACKBAR_TEXT = (txt: string) => `"${txt}" izkopēts!`;

@Directive({
  selector: '[appCopyClipboard]',
  host: {
    class: 'app-copy-clipboard',
    '(cdkCopyToClipboardCopied)': 'onComplete($event)',
  },
})
export class CopyClipboardDirective extends CdkCopyToClipboard {
  private snack = inject(MatSnackBar);

  @Input({ alias: 'appCopyClipboard' }) set strText(value: string) {
    this.text = value;
  }

  onComplete(result: boolean) {
    if (result === true) {
      this.snack.open(SNACKBAR_TEXT(this.text), 'OK', { duration: 2000 });
    }
  }
}
