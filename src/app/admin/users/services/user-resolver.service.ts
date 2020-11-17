import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from 'src/app/interfaces';
import { Observable, of } from 'rxjs';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { UsersService } from '../../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<User> {

  constructor(
    private usersService: UsersService,
    private simpleResolver: SimpleFormResolverService
  ) { }

  private retrieveFnFactory(id: string): RetrieveFn<User> {
    return () => {
      if (!id?.length) { return of(null); }
      return this.usersService.getUser(id);
    };
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> | Observable<never> {
    const id = route.paramMap.get('id');
    return this.simpleResolver.retrieve(state, this.retrieveFnFactory(id));
  }
}
