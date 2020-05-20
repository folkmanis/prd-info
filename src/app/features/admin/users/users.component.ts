import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouteSelection } from 'src/app/library/find-select-route/find-select-route.module';
import { User } from 'src/app/interfaces';
import { UsersService } from '../services/users.service';

type UserForSelection = Pick<User, 'username' | 'name'> & { title: string, link: (string | { [key: string]: any; })[]; };

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  private readonly _path = '/admin/users/edit';
  private readonly _newUserPath = '/admin/users/new';

  constructor(
    private usersService: UsersService,
  ) { }

  fltr = 'us';

  users$: Observable<UserForSelection[]> = this.usersService.users$.pipe(
    map(usrList =>
      usrList.map(usr => ({ username: usr.username, name: usr.name, title: usr.username, link: [this._path, { id: usr.username }] }))
    ),
    map(usrList => usrList.concat([{
      username: '<Jauns lietotājs>',
      name: 'Pievienot jaunu',
      title: '<Jauns lietotājs>',
      link: [this._newUserPath]
    }]))
  );

  ngOnInit() {
  }

}
