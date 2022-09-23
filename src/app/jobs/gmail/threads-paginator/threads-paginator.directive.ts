import { Directive, Host, Input, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Directive({
  selector: 'mat-paginator[appThreadsPaginator]'
})
export class ThreadsPaginatorDirective {

  @Output() threadPage = this.matPaginator.page;

  set length(value: number) {
    this.matPaginator.length = value || 0;
    this.matPaginator.disabled = !value;
  }
  get length() {
    return this.matPaginator.length;
  }

  constructor(
    @Host() private matPaginator: MatPaginator,
  ) { }

  firstPage() {
    if (this.matPaginator.hasPreviousPage()) {
      this.matPaginator.firstPage();
    } else {
      this.emitPageEvent(0);
    }
  }

  private emitPageEvent(previousPageIndex: number) {
    this.matPaginator.page.next({
      previousPageIndex,
      pageIndex: this.matPaginator.pageIndex,
      pageSize: this.matPaginator.pageSize,
      length: this.matPaginator.length,
    });
  }

}
