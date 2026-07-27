import { Directive, inject, input } from '@angular/core';
import { ConfirmationDialogService, navigateRelative } from 'src/app/library';
import { Job } from '../../interfaces';

@Directive({
  selector: '[appJobCopy]',
  host: {
    '(click)': 'onCopy()',
  },
})
export class JobCopyDirective {
  private dialog = inject(ConfirmationDialogService);
  private navigate = navigateRelative();

  job = input.required<Pick<Job, 'files' | 'jobId'>>({ alias: 'appJobCopy' });

  async onCopy() {
    const queryParams = { copyId: this.job().jobId, copyFiles: null as boolean | null };
    if (this.hasFolder()) {
      queryParams.copyFiles = await this.dialog.confirm('Vai kopēt arī visus failus?', {
        data: { title: 'Kopēt darbu' },
      });
    }
    this.navigate(['..', 'new'], { queryParams, state: { returnUrl: '/jobs/repro' } });
  }

  private hasFolder(): boolean {
    return Array.isArray(this.job().files?.path);
  }
}
