import { Component, OnInit, Input, Output } from '@angular/core';
import { JobBase } from 'src/app/interfaces';
import { getYear, format } from 'date-fns';
import { lv } from 'date-fns/locale';

function capitalize(s: string): string {
  if (typeof s !== 'string') { return ''; }
  return s[0].toUpperCase() + s.slice(1);
}
function removeDiactrics(s: string): string {
  return s.normalize('NFKD').replace(/[\u0300-\u036F]/g, '');
}

function toMonthNumberName(date: Date): string {
  return new Intl.DateTimeFormat(undefined, { month: '2-digit' }).format(date)
    + '-'
    + capitalize(removeDiactrics(new Intl.DateTimeFormat(undefined, { month: 'long' }).format(date)));
}

@Component({
  selector: 'app-folder-path',
  templateUrl: './folder-path.component.html',
  styleUrls: ['./folder-path.component.css']
})
export class FolderPathComponent implements OnInit {

  private _date: Date;
  @Input('date') set date(param: Date | string) {
    this._date = new Date(param);
    if (this._date) {
      console.log(this.pathArray(this._date));
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

  private pathArray(date: Date): string[] {
    return [
      getYear(date).toString(),
      toMonthNumberName(date),
    ];
  }

}
