import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpEventType,
} from '@angular/common/http';
import { concat, map, Observable, of, retry, switchMap, tap } from 'rxjs';
import { USE_KASTES_STORAGE, KastesLocalStorageService, KastesLocalStorageToken } from './kastes-local-storage.service';
import { log } from 'prd-cdk';
import { VeikalsKaste } from '../../interfaces';

@Injectable()
export class KastesLocalStorageInterceptor implements HttpInterceptor {


  constructor(
    private storage: KastesLocalStorageService,
  ) {

  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {


    if (request.method === 'GET' && /\/kastes\/\d+$/.test(request.url)) {
      return next.handle(request).pipe(
        tap(data => data.type === HttpEventType.Response && this.storage.storeVeikalsKastes(data.body as VeikalsKaste[])),
      );
    }

    if (request.method === 'PATCH' && request.context.has(USE_KASTES_STORAGE)) {
      return this.setGatavs(request as HttpRequest<VeikalsKaste>, next);
    }

    return next.handle(request);
  }

  private setGatavs(request: HttpRequest<VeikalsKaste>, next: HttpHandler): Observable<HttpEvent<VeikalsKaste>> {

    const { yesno, veikalsId, kaste } = request.context.get(USE_KASTES_STORAGE);

    const kastes = this.storage.getKastes();

    const idx = kastes.findIndex(k => k._id === veikalsId && k.kaste === kaste);

    if (idx === -1) {
      return next.handle(request);
    }

    if (kastes[idx].kastes.gatavs === yesno) {
      return of(new HttpResponse({ body: kastes[idx] }));
    }

    kastes[idx].kastes.gatavs = yesno;
    kastes[idx].pending = true;
    this.storage.storeVeikalsKastes(kastes);

    return concat(
      of(new HttpResponse({ body: kastes[idx] })),
      next.handle(request).pipe(
        retry({ count: 500, delay: 5000, }),
        tap(data => data.type === HttpEventType.Response && this.storage.updateStoredKaste(data.body)),
      ),
    );

  }

}
