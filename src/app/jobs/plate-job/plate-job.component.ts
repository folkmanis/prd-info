import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validator } from '@angular/forms';
import { ProductsService, CustomersService } from '../services';

@Component({
  selector: 'app-plate-job',
  templateUrl: './plate-job.component.html',
  styleUrls: ['./plate-job.component.css']
})
export class PlateJobComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) { }

  jobForm = this.fb.group({
    customer: [],
    name: [],
    customerJobId: [],
  });
  customers$ = this.customersService.customers$;

  ngOnInit(): void {
  }

}
