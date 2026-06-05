import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { XmfArchiveApiService } from './xmf-archive-api.service';

@Injectable({
  providedIn: 'root',
})
export class XmfSearchService {
  private api = inject(XmfArchiveApiService);

  getXmfCustomers(): Observable<string[]> {
    return this.api.getXmfCustomers();
  }
}
