import { Directive, ElementRef, HostListener, Input } from '@angular/core';

export type Events = 'escape' | 'ctrlPlus' | 'ctrlEnter';

const KEYS = new Map<Events, Partial<KeyboardEvent>>([
  ['escape', { key: 'Escape' }],
  ['ctrlPlus', { key: '+', ctrlKey: true, altKey: false }],
  ['ctrlEnter', { key: 'Enter', ctrlKey: true }],
]);

@Directive({
  selector: 'button[appKeyPress],a[appKeyPress]',
})
export class KeyPressDirective {
  @Input() set appKeyPress(value: Events) {
    this.eventToListen = KEYS.get(value as Events) || {};
  }

  eventToListen: Partial<KeyboardEvent> = {};

  constructor(
    private elRef: ElementRef<HTMLButtonElement>,
  ) { }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (isEqual(this.eventToListen, event)) {
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
