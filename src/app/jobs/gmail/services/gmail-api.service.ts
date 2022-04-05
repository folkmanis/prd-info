import { Injectable } from '@angular/core';
import { HttpOptions } from 'src/app/library/http';
import { HttpClient } from '@angular/common/http';
import { ClassTransformer } from 'class-transformer';
import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';
import { Attachment, Message, ThreadsFilterQuery, Thread, Threads, Label, LabelListItem } from '../interfaces';

@Injectable({
  providedIn: 'any'
})
export class GmailApiService {

  private readonly path = 'data/google/gmail/';

  private toClass = this.transformer.plainToInstance;

  constructor(
    private http: HttpClient,
    private transformer: ClassTransformer,
  ) { }

  getMessage(id: string): Observable<Message> {
    return this.http.get<Record<string, any>>(
      this.path + 'message/' + id,
      new HttpOptions().cacheable(),
    ).pipe(
      map(data => this.toClass(Message, data)),
    );
  }

  getThreads(query: ThreadsFilterQuery): Observable<Threads> {
    return this.http.get<Record<string, any>>(this.path + 'threads', new HttpOptions(query)).pipe(
      map(data => this.toClass(Threads, data)),
    );
  }

  getThread(id: string): Observable<Thread> {
    return this.http.get<Record<string, any>>(this.path + 'thread/' + id, new HttpOptions()).pipe(
      map(data => this.toClass(Thread, data)),
    );
  }

  getLabels(): Observable<LabelListItem[]> {
    return this.http.get<Record<string, any>>(this.path + 'labels', new HttpOptions().cacheable()).pipe(
      pluck('labels'),
      map(data => this.toClass(Label, data)),
    );
  }

  getLabel(id: string): Observable<Label> {
    return this.http.get<Record<string, any>>(this.path + 'label/' + id, new HttpOptions()).pipe(
      map(data => this.toClass(Label, data)),
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


