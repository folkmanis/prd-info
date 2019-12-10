import { Component, OnInit, Input } from '@angular/core';
/**
 * Meklē fragmentu steksta rindā un izceļ ar stiliem
 *
 * @param text - teksta rinda, kuru jāparāda
 * @param search - fragments, kurš jāizceļ
 * @param style - stili izcelšanai, formātā, kuru izmanto ngStyle.
 * @param exactMatch - prasīta pilna sakritība
 */
interface Chunk {
  text: string;
  style?: { [key: string]: string };
}

@Component({
  selector: 'app-tagged-string',
  template: `<span *ngFor="let chunk of chunks" [ngStyle]="chunk.style">{{chunk.text}}</span>`,
})
export class TaggedStringComponent implements OnInit {
  @Input() text: string;
  @Input() search: string;
  @Input() exactMatch: boolean = false;
  @Input('style') set st(s: { [key: string]: string }) {
    this.style = s;
  }

  chunks: Chunk[] = [];
  style: { [key: string]: string } = {
    'font-weight': 'bold',
    color: 'red',
  };
  constructor() { }

  ngOnInit() {

    if (!this.text) {
      return;  // Ja nav teksta, tad nav nekā
    }

    if (!this.search) {
      this.chunks.push({ text: this.text });
      return;
    }

    if (this.exactMatch) { // Ja prasīta pilna atbilstība
      if (this.text === this.search) {
        this.chunks.push({ text: this.text, style: this.style });
      } else {
        this.chunks.push({ text: this.text });
      }
    } else {
      let remainder = this.text;
      while (remainder.length > 0) {
        remainder = this.splitStr(remainder);
      }
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
