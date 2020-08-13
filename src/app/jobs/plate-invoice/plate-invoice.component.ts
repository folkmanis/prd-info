import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/layout.service';

@Component({
  selector: 'app-plate-invoice',
  templateUrl: './plate-invoice.component.html',
  styleUrls: ['./plate-invoice.component.css']
})
export class PlateInvoiceComponent implements OnInit {

  constructor(
    private layoutService: LayoutService,
  ) { }
  isSmall$ = this.layoutService.isSmall$;

  ngOnInit(): void {
  }

}
