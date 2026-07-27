import { computed, Directive, ElementRef, inject, input } from '@angular/core';
import { isEqual } from 'lodash-es';

export type Events = 'escape' | 'ctrlPlus' | 'ctrlEnter' | 'enter';

const KEYS = new Map<Events, Partial<KeyboardEvent>>([
  ['escape', { key: 'Escape' }],
  ['ctrlPlus', { key: '+', ctrlKey: true, altKey: false }],
  ['ctrlEnter', { key: 'Enter', ctrlKey: true }],
  ['enter', { key: 'Enter', ctrlKey: false }],
]);

@Directive({
  selector: 'button[appKeyPress],a[appKeyPress]',
  standalone: true,
  host: {
    '(window:keydown)': 'keyEvent($event)',
  },
})
export class KeyPressDirective {
  private elRef = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  appKeyPress = input.required<Events>();

  eventToListen = computed(() => KEYS.get(this.appKeyPress()) || {});

  keyEvent(event: Event) {
    if (isEqual(this.eventToListen(), event)) {
      this.elRef.nativeElement.click();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
