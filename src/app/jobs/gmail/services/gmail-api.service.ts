import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { cacheable, httpParams, validateAsync, validatorFn } from 'src/app/library';
import { z } from 'zod';
import {
  Attachment,
  Label,
  LabelListItem,
  LabelListItemSchema,
  LabelSchema,
  MessageModifyDto,
  Thread,
  Threads,
  ThreadSchema,
  ThreadsFilter,
  threadsQueryToFilter,
  ThreadsSchema,
} from '../interfaces';
import { MessageModifiedResponse, MessageModifiedResponseSchema } from '../interfaces/message-modified-response';

@Service()
export class GmailApiService {
  readonly #http = inject(HttpClient);
  readonly #path = getAppParams('apiPath') + 'google/gmail/';

  modifyMessage(id: string, messageModify: MessageModifyDto): Observable<MessageModifiedResponse> {
    return this.#http
      .patch(this.#path + 'message/' + id, messageModify)
      .pipe(map(validatorFn(MessageModifiedResponseSchema)));
  }

  getThreads(filter: ThreadsFilter): Promise<Threads> {
    const query = threadsQueryToFilter.encode(filter);
    const data$ = this.#http.get<Record<string, unknown>>(this.#path + 'threads', httpParams(query));
    return validateAsync(ThreadsSchema, data$);
  }

  async getThread(id: string): Promise<Thread> {
    const data$ = this.#http.get<Record<string, unknown>>(this.#path + 'thread/' + id);
    const data = await validateAsync(ThreadSchema, data$);
    return new Thread(data);
  }

  async getLabels(): Promise<LabelListItem[]> {
    const data$ = this.#http.get<Record<string, unknown>>(this.#path + 'labels', cacheable());
    const { labels } = await validateAsync(z.object({ labels: z.array(LabelListItemSchema) }), data$);
    return labels;
  }

  getLabel(id: string): Promise<Label> {
    const data$ = this.#http.get<Record<string, unknown>>(this.#path + 'label/' + id);
    return validateAsync(LabelSchema, data$);
  }

  attachmentToUserStorage(messageId: string, attachment: Attachment): Promise<{ names: string[] }> {
    const data$ = this.#http.put<{ names: string[] }>(this.#path + 'message/attachment', {
      messageId,
      attachment,
    });
    return validateAsync(z.object({ names: z.array(z.string()) }), data$);
  }
}
