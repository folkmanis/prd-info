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
  templateUrl: './tagged-string.component.html',
  styleUrls: ['./tagged-string.component.css']
})
export class TaggedStringComponent implements OnInit {

  @Input() text = '';
  @Input() search: string;
  @Input() style = 'font-weight: bold;';

  chunks: Chunk[] = [];
  objectStyles: { [key: string]: string } = {};
  constructor() { }

  ngOnInit() {
    this.objectStyles['font-weight'] = 'bold';
    this.objectStyles.color = 'red';
    if (!this.search) {
      this.chunks.push({ text: this.text, style: {} });
      return;
    }
    console.log(this.search);

    let remainder = this.text;
    while (remainder.length > 0) {
      remainder = this.splitStr(remainder);
    }
    console.log(this.chunks);
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
    this.chunks.push({ text: str.slice(idx, end), style: this.objectStyles });
    if (end <= str.length) {
      return str.slice(end);
    }
    return '';
  }

}
