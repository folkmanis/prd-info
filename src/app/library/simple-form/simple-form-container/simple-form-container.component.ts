import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { IFormGroup } from '@rxweb/types';


@Component({
  selector: 'app-simple-form-container',
  templateUrl: './simple-form-container.component.html',
  styleUrls: ['./simple-form-container.component.scss']
})
export class SimpleFormContainerComponent<T> implements OnInit {
  @Input() form: IFormGroup<T>;

  @Output() saveForm = new EventEmitter<void>();
  @Output() resetForm = new EventEmitter<void>();

  constructor(
    // private formService: SimpleFormService<T>,
  ) { }

  ngOnInit(): void {
  }

}
