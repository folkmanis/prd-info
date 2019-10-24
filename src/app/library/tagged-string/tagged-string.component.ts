import { Component, OnInit, Input } from '@angular/core';
/**
 * Tag string with attributes
 */
interface Chunk {
  text: string;
  style: { [key: string]: string };
}

@Component({
  selector: 'app-tagged-string',
  template: `<span *ngFor="let chunk of chunks" [ngStyle]="chunk.style">{{chunk.text}}</span>`,
})
export class TaggedStringComponent implements OnInit {

  @Input() text = '';
  @Input() search: string;
  @Input('styles') set st(s: { [key: string]: string }) {
    this.style = s;
  }

  chunks: Chunk[] = [];
  style: { [key: string]: string } = {
    'font-weight': 'bold',
    color: 'red',
  };
  constructor() { }

  ngOnInit() {

    if (!this.search) {
      this.chunks.push({ text: this.text, style: {} });
      return;
    }

    let remainder = this.text;
    while (remainder.length > 0) {
      remainder = this.splitStr(remainder);
    }
  }

  private splitStr(str: string): string {
    const search = this.search.toUpperCase();
    const idx = str.toUpperCase().indexOf(search);
    if (idx === -1) { // nav atrasts
      this.chunks.push({ text: str, style: {} });
      return ''; // atlikumā tukša rinda
    }
    if (idx > 0) {
      this.chunks.push({ text: str.slice(0, idx), style: {} });
    }
    const end = search.length + idx;
    this.chunks.push({ text: str.slice(idx, end), style: this.style });
    if (end <= str.length) {
      return str.slice(end);
    }
    return '';
  }

}
