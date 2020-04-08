import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
/**
 * Meklē fragmentu steksta rindā un izceļ ar stiliem
 *
 * @param text - teksta rinda, kuru jāparāda
 * @param search - fragments, kurš jāizceļ
 * @param style - stili izcelšanai, formātā, kuru izmanto ngStyle.
 */
interface Chunk {
  text: string;
  style?: { [key: string]: string; };
}

@Component({
  selector: 'app-tagged-string',
  template: `<span *ngFor="let chunk of chunks" [ngStyle]="chunk.style">{{chunk.text}}</span>`,
})
export class TaggedStringComponent implements OnInit, OnChanges {
  @Input() text: string;
  @Input() search: string;
  @Input('style') set st(s: { [key: string]: string; }) {
    this.style = s;
  }

  chunks: Chunk[];
  style: { [key: string]: string; } = {
    'font-weight': 'bold',
    color: 'red',
  };
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in changes) {
      if (!changes.hasOwnProperty(key)) {
        continue;
      }
      switch (key) {
        case 'text':
          this.text = changes[key].currentValue;
          break;
        case 'search':
          this.search = changes[key].currentValue;
          break;
      }
    }
    this.parseValues();
  }

  ngOnInit() {
    this.parseValues();
  }

  parseValues() {
    this.chunks = [];

    if (!this.text) {
      return;  // Ja nav teksta, tad nav nekā
    }

    if (!this.search) {
      this.chunks.push({ text: this.text });
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
    const search = this.search.toUpperCase();
    const idx = str.toUpperCase().indexOf(search);
    if (idx === -1) { // nav atrasts
      this.chunks.push({ text: str });
      return ''; // atlikumā tukša rinda
    }
    if (idx > 0) {
      this.chunks.push({ text: str.slice(0, idx) });
    }
    const end = search.length + idx;
    this.chunks.push({ text: str.slice(idx, end), style: this.style });
    if (end <= str.length) {
      return str.slice(end);
    }
    return '';
  }

}
