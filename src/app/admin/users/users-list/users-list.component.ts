import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from 'src/app/interfaces';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { LayoutService } from 'src/app/services';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {

  constructor(
    private usersService: UsersService,
    private layOutService: LayoutService,
  ) { }

  displayedColumns = [
    'username',
    'name',
    'last_login',
  ];
  large$ = this.layOutService.isLarge$;

  filter$ = new BehaviorSubject<string>('');

  users$ = combineLatest([
    this.usersService.users$,
    this.filter$.pipe(
      debounceTime(200),
      map(str => str.toUpperCase()),
    ),
  ]).pipe(
    map(this.userFilter)
  );

  private userFilter([users, filter]: [Partial<User>[], string]): Partial<User>[] {
    return users.filter(u => u.name.toUpperCase().includes(filter) || u.username.toUpperCase().includes(filter));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.filter$.complete();
  }

}
