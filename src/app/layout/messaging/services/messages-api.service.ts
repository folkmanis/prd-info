import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClassTransformer } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { HttpOptions } from 'src/app/library/http';
import { Message } from '../interfaces';

function addDataType(message: Record<string, any>) {
  return {
    ...message,
    data: {
      ...message.data,
      _type: message.module,
    },
  };
}

@Injectable({
  providedIn: 'root',
})
export class MessagesApiService {
  private readonly path = getAppParams('apiPath') + 'messages/';

  constructor(
    private http: HttpClient,
    private transformer: ClassTransformer,
  ) {}

  messages(): Observable<Message[]> {
    return this.http.get<Record<string, any>[]>(this.path, new HttpOptions()).pipe(
      map((messages) => messages.map((m) => addDataType(m))),
      map((resp) => this.transformer.plainToInstance(Message, resp)),
    );
  }

  setOneMessageRead(id: string): Observable<Message> {
    return this.http.patch<Record<string, any>>(this.path + 'read/' + id, new HttpOptions()).pipe(
      map((message) => addDataType(message)),
      map((resp) => this.transformer.plainToInstance(Message, resp)),
    );
  }

  setAllMessagesRead(): Observable<number> {
    return this.http.patch<{ modifiedCount: number }>(this.path + 'read', new HttpOptions()).pipe(map((data) => data.modifiedCount));
  }

  deleteMessage(id: string): Observable<number> {
    return this.http.delete<{ deletedCount: 0 | 1 }>(this.path + id, new HttpOptions()).pipe(map((data) => data.deletedCount));
  }
}
