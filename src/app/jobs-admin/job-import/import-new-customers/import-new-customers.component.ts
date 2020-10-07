import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Customer } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';

@Component({
  selector: 'app-import-new-customers',
  templateUrl: './import-new-customers.component.html',
  styleUrls: ['./import-new-customers.component.scss'],
})
export class ImportNewCustomersComponent implements OnInit {
  @Input('missingCodes')
  get missingCodes(): string[] { return this._missingCodes; }
  set missingCodes(_codes: string[]) {
    this._missingCodes = _codes;
    this.buildFormArray(_codes);
  }
  @Input() customersForm: FormArray;

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
  ) { }

  dataSource$ = new Subject<FormGroup[]>();
  displayedColumns = [
    'code',
    'CustomerName',
    'disabled',
    'desciption'
  ];
  private _missingCodes: string[];

  ngOnInit(): void {
  }

  private buildFormArray(codes: string[]) {
    this.customersForm.clear();
    codes.map(code => this.customersForm.push(
      this.fb.group(
        {
          code: [code],
          CustomerName: [
            '',
            {
              validators: Validators.required
            }
          ],
          disabled: [false],
          description: ['Importēts no vecajiem darbiem'],
        }
      )
    ));
    this.dataSource$.next(this.customersForm.controls as FormGroup[]);
  }

}
