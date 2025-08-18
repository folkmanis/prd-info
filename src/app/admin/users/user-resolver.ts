import { ResolveFn } from '@angular/router';
import { User } from 'src/app/interfaces';
import { UsersService } from './users.service';
import { inject } from '@angular/core';
import { notNullOrThrow } from 'src/app/library';

export const resolveUser: ResolveFn<User> = (route) => inject(UsersService).getUser(notNullOrThrow(route.paramMap.get('id')));
