import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
/**
 * Meklē fragmentu steksta rindā un izceļ ar stiliem
 *
 * @param text - teksta rinda, kuru jāparāda
 * @param search - fragments, kurš jāizceļ
 * @param style - stili izcelšanai, formātā, kuru izmanto ngStyle.
 */
interface Chunk {
  text: string;
  styled: boolean;
}

@Component({
  selector: 'app-tagged-string',
  template: `<span *ngFor="let chunk of chunks" [style]="chunk.styled ? style : undefined">{{chunk.text}}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaggedStringComponent {
  @Input() set text(text: string) {
    this._text = text;
    this.parseValues();
  }
  get text(): string { return this._text; }
  private _text = '';

  @Input() set search(search: string) {
    this._search = search;
    this.parseValues();
  }
  get search(): string | undefined { return this._search; }
  private _search: string | undefined;

  @Input() set style(style: { [key: string]: string; }) {
    this._style = style;
  }
  get style(): { [key: string]: string; } {
    return this._style;
  }
  private _style: { [key: string]: string; } = {
    'font-weight': 'bold',
    color: 'red',
  };

  chunks: Chunk[] = [];

  constructor() { }

  parseValues() {
    this.chunks = [];

    if (!this.text) {
      return;  // Ja nav teksta, tad nav nekā
    }

    if (!this.search) {
      this.chunks.push({ text: this.text, styled: false });
      return;
    }

    let remainder = this.text;
    while (remainder.length > 0) {
      remainder = this.splitStr(remainder);
    }

  }
  /**
   * Meklē rindu this.search rindā str.
   * String daļu pirms atrastā liek this.chunks masīvā bez style
   * Atrasto daļu liek this.chunks ar stilu this.style
   * Atgriež atlikušo daļu
   * @param str teksta rinda apstrādei
   */
  private splitStr(str: string): string {

    const idx = str.toUpperCase().indexOf(this.search.toUpperCase());

    if (idx === -1) { // nav atrasts
      this.chunks.push({ text: str, styled: false });
      return ''; // atlikumā tukša rinda
    }
    if (idx > 0) {
      this.chunks.push({ text: str.slice(0, idx), styled: false });
    }
    const end = this.search.length + idx;
    this.chunks.push({ text: str.slice(idx, end), styled: true });
    if (end <= str.length) {
      return str.slice(end);
    }
    return '';
  }

}
