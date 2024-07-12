import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { Directive, inject, input, output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const SNACKBAR_TEXT = (txt: string) => `"${txt}" izkopēts!`;

@Directive({
  selector: '[appCopyClipboard]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkCopyToClipboard,
      inputs: ['cdkCopyToClipboard: appCopyClipboard'],
      outputs: ['cdkCopyToClipboardCopied'],
    },
  ],
  host: {
    class: 'app-copy-clipboard',
    '(cdkCopyToClipboardCopied)': 'onComplete($event)',
  },
})
export class CopyClipboardDirective {
  private snack = inject(MatSnackBar);

  payload = input.required<string>({ alias: 'appCopyClipboard' });

  copied = output<boolean>({ alias: 'appCopyClipboardCopied' });

  onComplete(result: boolean) {
    if (result === true) {
      this.snack.open(SNACKBAR_TEXT(this.payload()), 'OK', { duration: 2000 });
    }
    this.copied.emit(result);
  }
}
