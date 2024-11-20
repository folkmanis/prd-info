import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CopyClipboardDirective } from 'src/app/library/clipboard/copy-clipboard.directive';
import { TaggedStringComponent } from 'src/app/library/tagged-string/tagged-string.component';
import { ArchiveRecord } from '../../interfaces';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-data-card',
    imports: [CopyClipboardDirective, TaggedStringComponent, DatePipe],
    templateUrl: './data-card.component.html',
    styleUrl: './data-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataCardComponent {
  data = input.required<ArchiveRecord>();

  searchString = input<string>();

  actions: string[] = ['', 'Archive', 'Restore', 'Skip', 'Delete'];
}
