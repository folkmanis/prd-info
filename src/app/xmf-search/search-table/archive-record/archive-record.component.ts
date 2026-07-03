import { Component, input } from '@angular/core';
import { CopyClipboardDirective } from 'src/app/library/clipboard/copy-clipboard.directive';
import { TaggedStringComponent } from './tagged-string/tagged-string.component';
import { ArchiveRecord } from '../../interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-archive-record',
  imports: [CopyClipboardDirective, TaggedStringComponent, DatePipe],
  templateUrl: './archive-record.component.html',
  styleUrl: './archive-record.component.scss',
})
export class ArchiveRecordComponent {
  data = input.required<ArchiveRecord>();

  searchString = input.required<string>();

  actions: string[] = ['', 'Archive', 'Restore', 'Skip', 'Delete'];
}
