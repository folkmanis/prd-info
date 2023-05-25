import { KastesJob } from 'src/app/jobs';
import { KastesPasutijumiService } from '../../services/kastes-pasutijumi.service';
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { EMPTY } from 'rxjs';

export const resolveKastesJob: ResolveFn<KastesJob> = (route) => {
    const id: number = +route.paramMap.get('id');
    if (isNaN(id)) { return EMPTY; }
    return inject(KastesPasutijumiService).getKastesJob(id);
};
