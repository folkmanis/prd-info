import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { User } from 'src/app/interfaces';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { UsersService } from '../../services/users.service';

@Injectable({
  providedIn: 'any'
})
export class UserResolverService extends SimpleFormResolverService<User> {

  constructor(
    router: Router,
    private usrService: UsersService,
  ) { super(router); }

  retrieveFn: RetrieveFn<User> = (route) => {
    const id = route.paramMap.get('id');
    if (!id?.length) { return EMPTY; }
    return this.usrService.getUser(id);
  }

}
