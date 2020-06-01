import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-status',
  template: `
    <h3>{{statuss}}</h3>
  `,
  styles: []
})
export class StatusComponent implements OnInit {
  @Input() set count(_count: number) {
    if (!_count || _count < 1) {
      this.statuss = 'Nav rezultātu';
    } else {
      const si = (_count % 10 === 1 && _count !== 11 ? 's' : 'i');
      this.statuss = `Atrast${si} ${_count} ierakst${si}`;
    }
  }

  statuss = '';

  constructor() { }

  ngOnInit(): void {
  }

}
