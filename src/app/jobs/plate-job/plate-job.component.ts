import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validator } from '@angular/forms';

@Component({
  selector: 'app-plate-job',
  templateUrl: './plate-job.component.html',
  styleUrls: ['./plate-job.component.css']
})
export class PlateJobComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
  ) { }

  jobForm = this.fb.group({
    customer: [],
    name: [],
    customerJobId: [],
  });

  ngOnInit(): void {
  }

}
