import { Injectable } from '@angular/core';
import { concatMap, from, map, Observable, toArray } from 'rxjs';
import { Attachment, Threads, ThreadsFilterQuery } from '../interfaces';
import { GmailApiService } from './gmail-api.service';



@Injectable({
  providedIn: 'any'
})
export class GmailService {


  constructor(
    private api: GmailApiService,
  ) { }

  getThreads(filter: ThreadsFilterQuery): Observable<Threads> {
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

  saveAttachments(attachments: { messageId: string, attachment: Attachment; }[]): Observable<string[]> {

    return from(attachments).pipe(
      concatMap(att => this.api.attachmentToUserStorage(att.messageId, att.attachment)),
      map(({ names }) => names[0]),
      toArray()
    );

  }



}
