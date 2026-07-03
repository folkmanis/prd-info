import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { XmfArchiveApiService } from './xmf-archive-api.service';

@Service()
export class XmfSearchService {
  private api = inject(XmfArchiveApiService);

  getXmfCustomers(): Observable<string[]> {
    return this.api.getXmfCustomers();
  }
}
