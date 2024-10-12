import { Clipboard } from '@angular/cdk/clipboard';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SanitizeService } from '../services/sanitize.service';

const SNACKBAR_TEXT = (txt: string) => `"${txt}" izkopēts!`;

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  private snack = inject(MatSnackBar);
  private cdkClipboard = inject(Clipboard);
  private sanitize = inject(SanitizeService);

  copy(text: string): boolean {
    const result = this.cdkClipboard.copy(text);
    if (result === true) {
      this.snack.open(SNACKBAR_TEXT(text), 'OK', { duration: 2000 });
    }
    return result;
  }

  copySanitized(text: string): boolean {
    return this.copy(this.sanitize.sanitizeFileName(text));
  }
}
