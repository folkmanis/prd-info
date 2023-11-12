import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlContainer, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-module-group',
    templateUrl: './module-group.component.html',
    styleUrls: ['./module-group.component.scss'],
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule]
})
export class ModuleGroupComponent implements OnInit {

  @Output() saving = new EventEmitter<any>();
  @Output() reseting = new EventEmitter<void>();

  controlForm: AbstractControl;

  constructor(
    private controlContainer: ControlContainer,
  ) { }


  ngOnInit(): void {
    this.controlForm = this.controlContainer.control;
  }

}
