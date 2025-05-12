import { Directive, inject, Input } from '@angular/core';
import { Job } from 'src/app/jobs';
import { SanitizeService } from '../services/sanitize.service';
import { CopyClipboardDirective } from './copy-clipboard.directive';

@Directive({
  selector: '[appCopyJobIdAndName]',
  host: {
    class: 'app-copy-clipboard',
    '(cdkCopyToClipboardCopied)': 'onComplete($event)',
  },
})
export class CopyJobIdAndNameDirective extends CopyClipboardDirective {
  private sanitize = inject(SanitizeService);

  @Input({ alias: 'appCopyJobIdAndName', required: true }) set job(value: Pick<Job, 'name'> & { jobId: number | null }) {
    if (value.jobId === null) {
      this.text = `${this.sanitize.sanitizeFileName(value.name)}`;
    } else {
      this.text = `${value.jobId}-${this.sanitize.sanitizeFileName(value.name)}`;
    }
  }
}
