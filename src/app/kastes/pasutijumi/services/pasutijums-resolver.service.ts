import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { KastesJob } from 'src/app/interfaces';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { PasutijumiService } from '../../services/pasutijumi.service';

@Injectable({
  providedIn: 'any'
})
export class PasutijumsResolverService extends SimpleFormResolverService<KastesJob> {

  constructor(
    router: Router,
    private pasService: PasutijumiService,
  ) { super(router); }

  retrieveFn: RetrieveFn<KastesJob> = (route) => {
    const id = +route.paramMap.get('id');
    return isNaN(id) ? EMPTY : this.pasService.getOrder(id);
  }

}
