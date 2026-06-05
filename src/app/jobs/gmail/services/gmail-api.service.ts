import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { ValidatorService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';
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

@Injectable({
  providedIn: 'root',
})
export class GmailApiService {
  readonly #http = inject(HttpClient);
  readonly #path = getAppParams('apiPath') + 'google/gmail/';
  #validator = inject(ValidatorService);

  modifyMessage(id: string, messageModify: MessageModifyDto): Observable<string> {
    return this.#http
      .patch(this.#path + 'message/' + id, messageModify, new HttpOptions())
      .pipe(map(this.#validator.validatorFn(z.string())));
  }

  getThreads(filter: ThreadsFilter): Promise<Threads> {
    const query = threadsQueryToFilter.encode(filter);
    const data$ = this.#http.get<Record<string, any>>(this.#path + 'threads', new HttpOptions(query));
    return this.#validator.validateAsync(ThreadsSchema, data$);
  }

  async getThread(id: string): Promise<Thread> {
    const data$ = this.#http.get<Record<string, any>>(this.#path + 'thread/' + id, new HttpOptions());
    const data = await this.#validator.validateAsync(ThreadSchema, data$);
    return new Thread(data);
  }

  async getLabels(): Promise<LabelListItem[]> {
    const data$ = this.#http.get<Record<string, any>>(this.#path + 'labels', new HttpOptions().cacheable());
    const { labels } = await this.#validator.validateAsync(z.object({ labels: z.array(LabelListItemSchema) }), data$);
    return labels;
  }

  getLabel(id: string): Promise<Label> {
    const data$ = this.#http.get<Record<string, any>>(this.#path + 'label/' + id, new HttpOptions());
    return this.#validator.validateAsync(LabelSchema, data$);
  }

  attachmentToUserStorage(messageId: string, attachment: Attachment): Promise<{ names: string[] }> {
    const data$ = this.#http.put<{ names: string[] }>(
      this.#path + 'message/attachment',
      {
        messageId,
        attachment,
      },
      new HttpOptions(),
    );
    return this.#validator.validateAsync(z.object({ names: z.array(z.string()) }), data$);
  }
}
