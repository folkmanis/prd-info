import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, filter, distinctUntilChanged, delay, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-xmf-search',
  templateUrl: './xmf-search.component.html',
  styleUrls: ['./xmf-search.component.css']
})
export class XmfSearchComponent implements OnInit {


  constructor() { }
  searchControl = new FormControl('');
  searchValue$: Observable<string> = this.searchControl.valueChanges.pipe(
    map((val: string) => val.trim()),
    filter((val) => val.length > 3),
    debounceTime(300),
    distinctUntilChanged(),
  );

  ngOnInit() {
    setTimeout(() => { this.searchControl.setValue('ottenst', { emitEvent: true }); }, 1000); // Testēšanai!!! Noņemt!!!
  }

}
