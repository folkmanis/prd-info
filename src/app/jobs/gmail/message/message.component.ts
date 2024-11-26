import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { FilesizePipe } from 'prd-cdk';
import { Attachment, Message } from '../interfaces';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionModule, MatButtonModule, MatIcon, MatMenuModule, MatCardModule, MatProgressBarModule, MatListModule, FilesizePipe, FormsModule],
})
export class MessageComponent {
  private sanitizer = inject(DomSanitizer);

  message = input.required<Message>();

  attachmentsConfirm = output<Attachment[]>();

  attachments = computed(() => this.message().attachments);

  attachmentsSelection = linkedSignal(() => this.attachments().filter((a) => a.isPdf));

  attachmentCompareFn = (a: Attachment, b: Attachment) => a.attachmentId === b.attachmentId;

  busy = signal(false);

  markAsRead = true;

  replaceBr(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));
  }

  onCreateJob() {
    this.attachmentsConfirm.emit(this.attachmentsSelection());
  }
}
