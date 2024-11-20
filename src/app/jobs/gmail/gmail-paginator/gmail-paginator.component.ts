import { ChangeDetectionStrategy, Component, computed, input, numberAttribute, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-gmail-paginator',
    templateUrl: './gmail-paginator.component.html',
    styleUrls: ['./gmail-paginator.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatMenuModule, MatIconModule]
})
export class GmailPaginatorComponent {
  activePage = input(0);

  pageSize = input(100, { transform: numberAttribute });

  lastPage = input(true);

  loadedCount = input(0);

  indexChanges = output<number>();

  start = computed(() => (this.loadedCount() ? this.activePage() * this.pageSize() + 1 : 0));

  end = computed(() => (this.loadedCount() ? this.activePage() * this.pageSize() + this.loadedCount() : 0));

  setPage(idx: number): void {
    this.indexChanges.emit(idx);
  }

  firstPage() {
    this.setPage(0);
  }

  nextPage() {
    if (this.lastPage() === false) {
      this.setPage(this.activePage() + 1);
    }
  }

  previousPage() {
    if (this.activePage() > 0) {
      this.setPage(this.activePage() - 1);
    }
  }
}
