import { Component, OnInit, Input } from '@angular/core';
import { KastesJob, Colors } from 'src/app/interfaces';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})
export class OrderTotalsComponent implements OnInit {
  @Input() job: KastesJob;
  @Input() colors: { [key in Colors]: string };

  constructor() { }

  ngOnInit(): void {
  }

}
