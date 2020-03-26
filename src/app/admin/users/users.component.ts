import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { pipe, Observable } from 'rxjs/index';
import { switchMap } from 'rxjs/operators';
import { UsersService } from '../services/users.service';
import { User, UserList } from '../services/admin-http.service';
import { RouteOrAction } from 'src/app/library/selector-finder/selector-finder.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
  ) {
    this.count$ = usersService.count$;
  }
  private readonly _path = '/admin/users/edit';
  routes$: Observable<RouteOrAction[]>;

  count$: Observable<number>;
  users: User[];
  userSelected: string;

  ngOnInit() {
    this.usersService.users$.subscribe(usrs => {
      this.users = usrs;
    });
    this.usersService.getUsers();
  }

}
