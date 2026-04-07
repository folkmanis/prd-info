import { Directive, inject, input } from '@angular/core';
import { Job } from 'src/app/jobs';
import { SanitizeService } from '../services/sanitize.service';
import { ClipboardService } from './clipboard.service';

@Directive({
  selector: '[appCopyJobIdAndName]',
  host: {
    class: 'app-copy-clipboard',
    '(click)': '$event.preventDefault(); onCopy()',
  },
})
export class CopyJobIdAndNameDirective {
  private sanitize = inject(SanitizeService);
  #clipboard = inject(ClipboardService);

  job = input.required<(Pick<Job, 'name'> & { jobId: number | null }) | undefined>({ alias: 'appCopyJobIdAndName' });

  protected onCopy() {
    const job = this.job();
    if (!job) {
      return;
    }
    const name = this.sanitize.sanitizeFileName(job.name);
    const text = job.jobId === null ? name : `${job.jobId}-${name}`;
    this.#clipboard.copy(text);
  }
}
