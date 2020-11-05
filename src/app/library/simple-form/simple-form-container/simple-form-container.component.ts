import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SimpleFormService } from '../simple-form-service';



@Component({
  selector: 'app-simple-form-container',
  templateUrl: './simple-form-container.component.html',
  styleUrls: ['./simple-form-container.component.scss']
})
export class SimpleFormContainerComponent<T> implements OnInit {

  @Output() saveForm = new EventEmitter<void>();
  @Output() resetForm = new EventEmitter<void>();

  constructor(
    private formService: SimpleFormService<T>,
  ) { }

  form = this.formService.form;

  ngOnInit(): void {
  }

}
