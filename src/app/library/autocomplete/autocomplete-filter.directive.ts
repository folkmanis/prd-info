import { computed, Directive, input, signal } from '@angular/core';

@Directive({
  selector: 'input[appAutocompleteFilter]',
  exportAs: 'appAutocompleteFilter',
  host: {
    '(input)': 'onInput($event)',
  },
})
export class AutocompleteFilterDirective {
  autocompleteValues = input.required<string[]>({ alias: 'appAutocompleteFilter' });

  #inputValue = signal('');

  options = computed(() => {
    const i = this.#inputValue()?.toUpperCase() ?? '';
    return this.autocompleteValues().filter((p) => p.toUpperCase().includes(i));
  });

  protected onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.#inputValue.set(target.value);
  }

  reset() {
    this.#inputValue.set('');
  }
}
