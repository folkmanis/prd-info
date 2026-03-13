import { computed, Directive, input, signal } from '@angular/core';

@Directive({
  selector: 'input[appAutocompleteFilter]',
  exportAs: 'appAutocompleteFilter',
  host: {
    '(input)': 'onInput($event)',
  },
})
export class AutocompleteFilterDirective {
  values = input.required<string[]>({ alias: 'appAutocompleteFilter' });

  options = computed(() => {
    const input = this.#inputValue()?.toUpperCase() ?? '';
    return this.values().filter((p) => p.toUpperCase().includes(input));
  });

  #inputValue = signal('');

  protected onInput(event: any) {
    this.#inputValue.set(event.target.value);
  }

  reset() {
    this.#inputValue.set('');
  }
}
