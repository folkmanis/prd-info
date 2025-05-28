import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { ValidatorService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';
import { z } from 'zod/v4';
import { JobMessageData, Message, XmfUploadMessageData } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MessagesApiService {
  #path = getAppParams('apiPath') + 'messages/';
  #validator = inject(ValidatorService);
  #http = inject(HttpClient);

  async getAllMessages(): Promise<Message[]> {
    const data = await firstValueFrom(this.#http.get<Record<string, any>[]>(this.#path, new HttpOptions()));
    const messages = data.map((message) => this.#addDataType(message));
    return this.#validator.validateArray(Message, messages);
  }

  async setOneMessageRead(id: string): Promise<Message> {
    const data = await firstValueFrom(this.#http.patch<Record<string, any>>(this.#path + 'read/' + id, new HttpOptions()));
    const message = this.#addDataType(data);
    return this.#validator.validate(Message, message);
  }

  async setAllMessagesRead(): Promise<number> {
    const data$ = this.#http.patch<{ modifiedCount: number }>(this.#path + 'read', new HttpOptions());
    const obj = await this.#validator.validateAsync(z.object({ modifiedCount: z.number() }), data$);
    return obj.modifiedCount;
  }

  async deleteMessage(id: string): Promise<number> {
    const data$ = this.#http.delete<{ deletedCount: 0 | 1 }>(this.#path + id, new HttpOptions());
    const obj = await this.#validator.validateAsync(z.object({ deletedCount: z.number() }), data$);
    return obj.deletedCount;
  }

  #addDataType(message: Record<string, any>) {
    switch (message.module) {
      case 'jobs':
        return {
          ...message,
          data: new JobMessageData(message.data),
        };
      case 'xmf-upload':
        return {
          ...message,
          data: new XmfUploadMessageData(message.data),
        };
    }
    return message;
  }
}
