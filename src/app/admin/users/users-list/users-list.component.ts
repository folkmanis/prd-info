import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SimpleListContainerComponent,
    MatTableModule,
    RouterLink,
    RouterLinkActive,
    DatePipe,
  ],
})
export class UsersListComponent {
  displayedColumns = ['username', 'name', 'last_login'];

  filter = signal('');

  private users = toSignal(inject(UsersService).users$, { initialValue: [] });

  usersFiltered = computed(() => {
    const filterUpperStr = this.filter().toUpperCase();
    return this.users().filter(
      (u) =>
        u.name.toUpperCase().includes(filterUpperStr) ||
        u.username.toUpperCase().includes(filterUpperStr)
    );
  });
}
