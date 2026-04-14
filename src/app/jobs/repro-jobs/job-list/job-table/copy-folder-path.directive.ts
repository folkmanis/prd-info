import { Directive, inject, input, signal } from '@angular/core';
import { ClipboardService } from 'src/app/library';
import { ReproJobService } from '../../services/repro-job.service';
import { updateCatching } from 'src/app/library/update-catching';
import { configuration } from 'src/app/services/config.provider';

@Directive({
  selector: 'button[appCopyFolderPath]',
  host: {
    class: 'app-copy-clipboard',
    '(click)': '$event.preventDefault(); onCopy()',
    '[disabled]': 'busy()',
  },
})
export class CopyFolderPathDirective {
  #clipboard = inject(ClipboardService);
  #service = inject(ReproJobService);
  #jobsConfig = configuration('jobs');

  protected busy = signal(false);
  #resolve = updateCatching(this.busy);

  jobId = input.required<number>({ alias: 'appCopyFolderPath' });

  protected async onCopy() {
    await this.#resolve(async (message) => {
      const path = await this.#service.getFolderLocation(this.jobId());
      if (!path) {
        message(`Darbam ${this.jobId()} nav foldera!`);
        return;
      }
      const fullPath = `${this.#jobsConfig().jobRootPath}\\${path.join('\\')}`;

      this.#clipboard.copy(fullPath);
    });
  }
}
