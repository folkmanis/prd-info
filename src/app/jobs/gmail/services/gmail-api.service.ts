import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { AppClassTransformerService } from 'src/app/library/class-transformer/app-class-transformer.service';
import { HttpOptions } from 'src/app/library/http';
import { Attachment, Label, LabelListItem, Message, MessageModifyDto, Thread, Threads, ThreadsFilterQuery } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GmailApiService {
  private readonly http = inject(HttpClient);
  private readonly transformer = inject(AppClassTransformerService);

  private readonly path = getAppParams('apiPath') + 'google/gmail/';

  getMessage(id: string): Observable<Message> {
    return this.http.get<Record<string, any>>(this.path + 'message/' + id, new HttpOptions().cacheable()).pipe(this.transformer.toClass(Message));
  }

  modifyMessage(id: string, messageModify: MessageModifyDto): Observable<Message> {
    return this.http.patch<Record<string, any>>(this.path + 'message/' + id, messageModify, new HttpOptions()).pipe(this.transformer.toClass(Message));
  }

  getThreads(query: ThreadsFilterQuery): Promise<Threads> {
    const data$ = this.http.get<Record<string, any>>(this.path + 'threads', new HttpOptions(query));
    return this.transformer.toInstanceAsync(Threads, data$);
  }

  getThread(id: string): Observable<Thread> {
    return this.http.get<Record<string, any>>(this.path + 'thread/' + id, new HttpOptions()).pipe(this.transformer.toClass(Thread));
  }

  getLabels(): Observable<LabelListItem[]> {
    return this.http.get<Record<string, any>>(this.path + 'labels', new HttpOptions().cacheable()).pipe(
      map((data) => data['labels']),
      this.transformer.toClass(Label),
    );
  }

  getLabel(id: string): Observable<Label> {
    return this.http.get<Record<string, any>>(this.path + 'label/' + id, new HttpOptions()).pipe(this.transformer.toClass(Label));
  }

  attachmentToUserStorage(messageId: string, attachment: Attachment): Observable<{ names: string[] }> {
    return this.http.put<{ names: string[] }>(
      this.path + 'message/attachment',
      {
        messageId,
        attachment,
      },
      new HttpOptions(),
    );
  }
}
