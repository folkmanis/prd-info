import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-kastes-totals',
  templateUrl: './kastes-totals.component.html',
  styleUrls: ['./kastes-totals.component.scss']
})
export class KastesTotalsComponent implements OnInit {
  @Input() totals: [number, number][] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
