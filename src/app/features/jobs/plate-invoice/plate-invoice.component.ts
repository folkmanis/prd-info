import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plate-invoice',
  templateUrl: './plate-invoice.component.html',
  styleUrls: ['./plate-invoice.component.css']
})
export class PlateInvoiceComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

}
