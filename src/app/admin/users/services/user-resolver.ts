import { ResolveFn } from '@angular/router';
import { User } from 'src/app/interfaces';
import { UsersService } from '../../services/users.service';
import { inject } from '@angular/core';

export const resolveUser: ResolveFn<User> = (route) =>
    inject(UsersService).getUser(route.paramMap.get('id'));
