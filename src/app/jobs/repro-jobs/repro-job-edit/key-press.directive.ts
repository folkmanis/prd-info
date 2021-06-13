import { Directive, Input, HostListener, ElementRef, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../services/repro-job-dialog.service';
import { ReproJobEditComponent } from './repro-job-edit.component';
import { DestroyService, log } from 'prd-cdk';
import { filter, takeUntil } from 'rxjs/operators';

export type Events = 'escape' | 'ctrlPlus' | 'ctrlEnter';

const KEYS = new Map<Events, Partial<KeyboardEvent>>([
  ['escape', { key: 'Escape' }],
  ['ctrlPlus', { key: '+', ctrlKey: true, altKey: false }],
  ['ctrlEnter', { key: 'Enter', ctrlKey: true }],
]);

@Directive({
  selector: 'button[appKeyPress]',
  providers: [DestroyService],
})
export class KeyPressDirective implements OnInit {
  @Input() set appKeyPress(value: Events) {
    this.eventToListen = KEYS.get(value as Events) || {};
  }

  eventToListen: Partial<KeyboardEvent> = {};

  constructor(
    private elRef: ElementRef<HTMLButtonElement>,
    private dialogRef: MatDialogRef<ReproJobEditComponent, DialogData>,
    private destroy$: DestroyService,
  ) { }

  ngOnInit() {
    this.dialogRef.keydownEvents().pipe(
      filter(event => isEqual(this.eventToListen, event)),
      takeUntil(this.destroy$),
    ).subscribe(event => {
      event.preventDefault();
      event.stopPropagation();
      this.elRef.nativeElement.click();
    });
  }

}

function isEqual(obj1: { [key: string]: any }, obj2: { [key: string]: any }): boolean {
  const props1 = Object.getOwnPropertyNames(obj1);

  for (const prop of props1) {
    if (obj1[prop] !== obj2[prop]) {
      return false;
    }
  }

  return true;
}
