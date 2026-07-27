import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  imports: [SimpleListContainerComponent, MatTableModule, RouterLink, RouterLinkActive, DatePipe],
})
export class UsersListComponent {
  protected displayedColumns = ['username', 'name', 'last_login'];

  protected name = signal('');

  protected filter = computed(() => ({ name: this.name().trim() || undefined }));

  protected users = inject(UsersService).getUsersResource(this.filter);

  onReload() {
    this.users.reload();
  }
}
