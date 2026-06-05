import { inject, Injectable } from '@angular/core';
import { Attachment, Message, Threads, ThreadsFilter } from '../interfaces';
import { GmailApiService } from './gmail-api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private api = inject(GmailApiService);

  getThreads(filter: ThreadsFilter): Promise<Threads> {
    return this.api.getThreads(filter);
  }

  thread(id: string) {
    return this.api.getThread(id);
  }

  labels() {
    return this.api.getLabels();
  }

  label(id: string) {
    return this.api.getLabel(id);
  }

  markAsRead(message: Message): Observable<string> {
    if (message.hasLabel('UNREAD')) {
      return this.api.modifyMessage(message.id, { removeLabelIds: ['UNREAD'] });
    } else {
      return of(message.id);
    }
  }

  async saveAttachments(attachments: { messageId: string; attachment: Attachment }[]): Promise<string[]> {
    const result = [] as string[];
    for await (const att of attachments) {
      const data = await this.api.attachmentToUserStorage(att.messageId, att.attachment);
      result.push(data.names[0]);
    }
    return result;
  }
}
