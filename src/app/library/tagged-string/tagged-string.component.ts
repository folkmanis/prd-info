import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

interface Chunk {
  text: string;
  style?: Record<string, string>;
}

const DEFAULT_STYLE = {
  'font-weight': 'bold',
  color: 'red',
};
@Component({
  selector: 'app-tagged-string',
  templateUrl: 'tagged-string.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TaggedStringComponent {

  text = input.required<string>();

  styledString = input('');

  highlightedStyle = input<Record<string, string>>(DEFAULT_STYLE);

  chunks = computed(() => this.createChunks(this.text(), this.styledString(), this.highlightedStyle()));

  private createChunks(text: string, styledString: string, style: Record<string, string>): Chunk[] {

    if (!styledString) {
      return [{ text, style: undefined }];
    }

    const chunks = [] as Chunk[];
    let remainder = text;

    while (remainder.length > 0) {

      const idx = remainder.toUpperCase().indexOf(styledString.toUpperCase());

      if (idx === -1) {
        chunks.push({ text: remainder, style: undefined });
        remainder = '';
      }
      if (idx > 0) {
        chunks.push({ text: remainder.slice(0, idx), style: undefined });
        remainder = remainder.slice(idx);
      }
      if (idx === 0) {
        const end = styledString.length + idx;
        chunks.push({
          text: remainder.slice(idx, end),
          style
        });
        remainder = remainder.slice(end);
      }

    }

    return chunks;

  }
}
