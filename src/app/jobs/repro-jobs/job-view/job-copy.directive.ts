import { Directive, inject, input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library';
import { navigateRelative } from 'src/app/library/navigation';
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

  job = input.required<Job>({ alias: 'appJobCopy' });

  async onCopy() {
    const queryParams = { copyId: this.job().jobId, copyFiles: null };
    if (this.hasFolder()) {
      const shouldCopyFiles$ = this.dialog.confirm('Vai kopēt arī visus failus?', { data: { title: 'Kopēt darbu' } });
      queryParams.copyFiles = await firstValueFrom(shouldCopyFiles$);
    }
    this.navigate(['..', 'new'], { queryParams, state: { returnUrl: '/jobs/repro' } });
  }

  private hasFolder(): boolean {
    return Array.isArray(this.job().files?.path);
  }
}
