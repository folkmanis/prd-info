import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SimpleListContainerComponent, MatTableModule, RouterLink, RouterLinkActive, DatePipe],
})
export class UsersListComponent {
  displayedColumns = ['username', 'name', 'last_login'];

  filter = signal('');

  private users = inject(UsersService).getUsersResource();

  usersFiltered = computed(() => {
    const filterUpperStr = this.filter()?.toUpperCase() || '';
    return this.users.value().filter((user) => user.name.toUpperCase().includes(filterUpperStr) || user.username.toUpperCase().includes(filterUpperStr));
  });

  onReload() {
    this.users.reload();
  }
}
