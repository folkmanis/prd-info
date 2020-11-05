import { Component, OnInit, Input, Output } from '@angular/core';
import { IFormControl } from '@rxweb/types';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-simple-list-container',
  templateUrl: './simple-list-container.component.html',
  styleUrls: ['./simple-list-container.component.scss']
})
export class SimpleListContainerComponent implements OnInit {

  searchControl: IFormControl<string> = new FormControl('');

  @Input() large = true;

  @Output() filter = this.searchControl.valueChanges;

  constructor() { }


  ngOnInit(): void {
  }

}
