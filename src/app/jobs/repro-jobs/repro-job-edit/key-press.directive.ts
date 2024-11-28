import { computed, Directive, ElementRef, inject, input } from '@angular/core';

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

  keyEvent(event: KeyboardEvent) {
    if (isEqual(this.eventToListen(), event)) {
      this.elRef.nativeElement.click();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}

function isEqual(obj1: Record<string, any>, obj2: Record<string, any>): boolean {
  const props1 = Object.getOwnPropertyNames(obj1);

  for (const prop of props1) {
    if (obj1[prop] !== obj2[prop]) {
      return false;
    }
  }

  return true;
}
