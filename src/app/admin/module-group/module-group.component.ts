import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlContainer, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-module-group',
  templateUrl: './module-group.component.html',
  styleUrls: ['./module-group.component.scss']
})
export class ModuleGroupComponent implements OnInit {

  @Output() saving = new EventEmitter<any>();
  @Output() reseting = new EventEmitter<void>();

  constructor(
    private controlContainer: ControlContainer,
  ) { }

  controlForm: AbstractControl;

  ngOnInit(): void {
    this.controlForm = this.controlContainer.control;
  }

}
