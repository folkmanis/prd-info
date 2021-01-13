import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { KastesJob } from 'src/app/interfaces';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { PasutijumiService } from '../../services/pasutijumi.service';

@Injectable({
  providedIn: 'any'
})
export class KastesJobResolverService extends SimpleFormResolverService<KastesJob> {

  constructor(
    router: Router,
    private pasutijumiService: PasutijumiService,
  ) { super(router); }

  protected retrieveFn: RetrieveFn<KastesJob> = (route) => {
    const id: number = +route.paramMap.get('id');
    if (isNaN(id)) { return EMPTY; }
    return this.pasutijumiService.getOrder(id);
  }
}

