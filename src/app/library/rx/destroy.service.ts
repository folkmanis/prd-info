import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DestroyService extends Observable<void> implements OnDestroy {

  private readonly lifecycle$ = new Subject<void>();

  constructor() {
    super(subscriber => this.lifecycle$.subscribe(subscriber));
  }

  ngOnDestroy() {
    this.lifecycle$.next();
    this.lifecycle$.complete();
  }
}
