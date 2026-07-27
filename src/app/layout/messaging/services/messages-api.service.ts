import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { pluckDeletedCount, pluckModifiedCount } from 'src/app/interfaces';
import { validatorFn } from 'src/app/library';
import { Message } from '../interfaces';

@Service()
export class MessagesApiService {
  #path = getAppParams('apiPath') + 'messages/';
  #http = inject(HttpClient);

  getAllMessages(): Promise<Message[]> {
    const data$ = this.#http.get(this.#path).pipe(map(validatorFn(Message.array())));
    return firstValueFrom(data$);
  }

  setOneMessageRead(id: string): Promise<Message> {
    const data$ = this.#http.patch(this.#path + 'read/' + id, {}).pipe(map(validatorFn(Message)));
    return firstValueFrom(data$);
  }

  setAllMessagesRead(): Promise<number> {
    const data$ = this.#http.patch(this.#path + 'read', {}).pipe(pluckModifiedCount());
    return firstValueFrom(data$);
  }

  deleteMessage(id: string): Promise<number> {
    const data$ = this.#http.delete(this.#path + id).pipe(pluckDeletedCount());
    return firstValueFrom(data$);
  }
}
