import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: 'input[appInputUppercase],textarea[appInputUppercase]',
  standalone: true,
  host: {
    '(input)': 'onInput()',
  },
})
export class InputUppercaseDirective {
  private readonly el = inject(ElementRef<HTMLInputElement | HTMLTextAreaElement>);
  private syncing = false;

  onInput() {
    if (this.syncing) return;

    const input = this.el.nativeElement;
    const value = input.value;
    const upper = value.toUpperCase();

    if (value === upper) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;

    this.syncing = true;
    input.value = upper;

    if (start !== null && end !== null) {
      queueMicrotask(() => input.setSelectionRange(start, end));
    }

    input.dispatchEvent(new Event('input', { bubbles: true }));
    this.syncing = false;
  }
}
