import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-simple-form-container',
  templateUrl: './simple-form-container.component.html',
  styleUrls: ['./simple-form-container.component.scss']
})
export class SimpleFormContainerComponent implements OnInit {

  @Input() form: AbstractControl;

  @Output() data = this.route.data.pipe(map(data => data.value));
  @Output() saveForm = new EventEmitter<void>();
  @Output() resetForm = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

}
