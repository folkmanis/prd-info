import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-status',
  template: `{{statuss}}`,
  styles: []
})
export class StatusComponent {

  statuss = '';

  @Input() set count(value: number) {
    if (!value) {
      this.statuss = 'Nav rezultātu';
    } else {
      const si = (value % 10 === 1 && value !== 11 ? 's' : 'i');
      this.statuss = `Atrast${si} ${value} ierakst${si}`;
    }
  }


}
