import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-kastes-input',
  templateUrl: './kastes-input.component.html',
  styleUrls: ['./kastes-input.component.css']
})
export class KastesInputComponent implements OnInit {

  constructor(
    private controlContainer: ControlContainer
  ) { }

  get controlsArray(): FormArray { return this.controlContainer.control as FormArray;}
  get controls(): FormGroup[] { return this.controlsArray.controls as FormGroup[]; }

  ngOnInit(): void {
  }

}
