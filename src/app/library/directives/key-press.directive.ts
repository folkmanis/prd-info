import { computed, Directive, ElementRef, inject, input } from '@angular/core';

export type Events = 'escape' | 'ctrlPlus' | 'ctrlEnter' | 'enter';

type EventConfig = Record<Events, Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'altKey'>>;

const eventsMap: EventConfig = {
  escape: { key: 'Escape', ctrlKey: false, altKey: false },
  ctrlPlus: { key: '+', ctrlKey: true, altKey: false },
  ctrlEnter: { key: 'Enter', ctrlKey: true, altKey: false },
  enter: { key: 'Enter', ctrlKey: false, altKey: false },
};

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

  eventToListen = computed(() => eventsMap[this.appKeyPress()]);

  keyEvent(event: Event) {
    const etl = this.eventToListen();
    const { key, ctrlKey, altKey } = event as KeyboardEvent;
    if (key === etl.key && ctrlKey === etl.ctrlKey && altKey === etl.altKey) {
      this.elRef.nativeElement.click();
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
