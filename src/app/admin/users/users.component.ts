import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { pipe } from 'rxjs/index';
import { switchMap } from 'rxjs/operators';
import { UsersService } from '../services/users.service';
import { User, UserList } from '../services/http.service';

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
  ) { }

  count: number = 0;
  users: User[];
  username: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.username = params.get('id');
    });

    this.usersService.getUsers().subscribe(usrs => {
      this.count = usrs.count;
      this.users = usrs.users;
    });
  }

}
