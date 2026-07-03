import { Component, computed, input } from '@angular/core';

interface Chunk {
  text: string;
  highlighted: boolean;
}

@Component({
  selector: 'app-tagged-string',
  templateUrl: 'tagged-string.component.html',
  standalone: true,
  styleUrls: ['tagged-string.component.scss'],
})
export class TaggedStringComponent {
  text = input.required<string>();

  styledString = input('');

  protected chunks = computed(() => this.#createChunks(this.text(), this.styledString()));

  #createChunks(text: string, styledString: string): Chunk[] {
    if (!styledString) {
      return [{ text, highlighted: false }];
    }

    const chunks = [] as Chunk[];
    let remainder = text;

    while (remainder.length > 0) {
      const idx = remainder.toUpperCase().indexOf(styledString.toUpperCase());

      if (idx === -1) {
        chunks.push({ text: remainder, highlighted: false });
        remainder = '';
      }
      if (idx > 0) {
        chunks.push({ text: remainder.slice(0, idx), highlighted: false });
        remainder = remainder.slice(idx);
      }
      if (idx === 0) {
        const end = styledString.length + idx;
        chunks.push({
          text: remainder.slice(idx, end),
          highlighted: true,
        });
        remainder = remainder.slice(end);
      }
    }

    return chunks;
  }
}
