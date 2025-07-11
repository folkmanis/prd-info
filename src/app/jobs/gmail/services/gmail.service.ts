import { inject, Injectable } from '@angular/core';
import { Attachment, Message, Threads, ThreadsFilterQuery } from '../interfaces';
import { GmailApiService } from './gmail-api.service';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private api = inject(GmailApiService);

  getThreads(filter: ThreadsFilterQuery): Promise<Threads> {
    return this.api.getThreads(filter);
  }

  thread(id: string) {
    return this.api.getThread(id);
  }

  message(id: string) {
    return this.api.getMessage(id);
  }

  labels() {
    return this.api.getLabels();
  }

  label(id: string) {
    return this.api.getLabel(id);
  }

  markAsRead(message: Message): Promise<Message> {
    if (message.hasLabel('UNREAD')) {
      return this.api.modifyMessage(message.id, { removeLabelIds: ['UNREAD'] });
    } else {
      return Promise.resolve(message);
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
