import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from 'src/app/interfaces';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit, OnDestroy {

  displayedColumns = [
    'username',
    'name',
    'last_login',
  ];

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

  constructor(
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.filter$.complete();
  }

  private userFilter([users, filter]: [Partial<User>[], string]): Partial<User>[] {
    return users.filter(u => u.name.toUpperCase().includes(filter) || u.username.toUpperCase().includes(filter));
  }

}
