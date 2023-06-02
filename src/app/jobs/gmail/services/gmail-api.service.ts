import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { AppClassTransformerService } from 'src/app/library/class-transformer/app-class-transformer.service';
import { HttpOptions } from 'src/app/library/http';
import { Attachment, Label, LabelListItem, Message, MessageModifyDto, Thread, Threads, ThreadsFilterQuery } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class GmailApiService {

  private readonly path = getAppParams('apiPath') + 'google/gmail/';

  constructor(
    private http: HttpClient,
    private transf: AppClassTransformerService,
  ) { }

  getMessage(id: string): Observable<Message> {
    return this.http.get<Record<string, any>>(
      this.path + 'message/' + id,
      new HttpOptions().cacheable(),
    ).pipe(
      this.transf.toClass(Message),
    );
  }

  modifyMessage(id: string, messageModify: MessageModifyDto): Observable<Message> {
    return this.http.patch<Record<string, any>>(
      this.path + 'message/' + id,
      messageModify,
      new HttpOptions(),
    ).pipe(
      this.transf.toClass(Message),
    );
  }

  getThreads(query: ThreadsFilterQuery): Observable<Threads> {
    return this.http.get<Record<string, any>>(this.path + 'threads', new HttpOptions(query)).pipe(
      this.transf.toClass(Threads),
    );
  }

  getThread(id: string): Observable<Thread> {
    return this.http.get<Record<string, any>>(this.path + 'thread/' + id, new HttpOptions()).pipe(
      this.transf.toClass(Thread),
    );
  }

  getLabels(): Observable<LabelListItem[]> {
    return this.http.get<Record<string, any>>(this.path + 'labels', new HttpOptions().cacheable()).pipe(
      map(data => data['labels']),
      this.transf.toClass(Label),
    );
  }

  getLabel(id: string): Observable<Label> {
    return this.http.get<Record<string, any>>(this.path + 'label/' + id, new HttpOptions()).pipe(
      this.transf.toClass(Label),
    );
  }

  attachmentToUserStorage(messageId: string, attachment: Attachment): Observable<{ names: string[]; }> {
    return this.http.put<{ names: string[]; }>(
      this.path + 'message/attachment',
      {
        messageId,
        attachment
      },
      new HttpOptions());
  }


}


