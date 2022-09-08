import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-kastes-totals',
  templateUrl: './kastes-totals.component.html',
  styleUrls: ['./kastes-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KastesTotalsComponent implements OnInit {
  @Input() totals: [number, number][] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
