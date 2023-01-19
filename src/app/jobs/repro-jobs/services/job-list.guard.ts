import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, createUrlTreeFromSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DEFAULT_FILTER } from '../../interfaces';


@Injectable({
  providedIn: 'root'
})
export class JobListGuard implements CanActivate {


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!route.queryParams['jobStatus']) {
      const queryParams = { ...route.queryParams };
      queryParams.jobStatus = DEFAULT_FILTER.jobStatus;
      const url = createUrlTreeFromSnapshot(route, [], queryParams);
      return url;
    }
    return true;
  }

}
