import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getAppParams } from 'src/app/app-params';
import { ValidatorService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';
import { z } from 'zod/v4';
import {
  Attachment,
  Label,
  LabelListItem,
  LabelListItemSchema,
  LabelSchema,
  Message,
  MessageModifyDto,
  MessageSchema,
  Thread,
  Threads,
  ThreadSchema,
  ThreadsFilterQuery,
  ThreadsSchema,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GmailApiService {
  readonly #http = inject(HttpClient);
  readonly #path = getAppParams('apiPath') + 'google/gmail/';
  #validator = inject(ValidatorService);

  async getMessage(id: string): Promise<Message> {
    const data$ = this.#http.get<Record<string, any>>(this.#path + 'message/' + id, new HttpOptions().cacheable());
    const data = await this.#validator.validateAsync(MessageSchema, data$);
    return new Message(data);
  }

  async modifyMessage(id: string, messageModify: MessageModifyDto): Promise<Message> {
    const data$ = this.#http.patch<Record<string, any>>(this.#path + 'message/' + id, messageModify, new HttpOptions());
    const data = await this.#validator.validateAsync(MessageSchema, data$);
    return new Message(data);
  }

  getThreads(query: ThreadsFilterQuery): Promise<Threads> {
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
