import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { GoogleUser } from 'src/app/interfaces';
import { pick } from 'lodash';

const FIELDS_FOR_DISPLAY: (keyof GoogleUser)[] = [
  'id',
  'email',
  'name',
  'given_name',
  'family_name',
  'gender',
  'locale',
];

@Component({
  selector: 'app-google-info',
  templateUrl: './google-info.component.html',
  styleUrls: ['./google-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleInfoComponent implements OnInit {

  values: [string, string][] = [];

  @Input() set googleInfo(value: GoogleUser) {
    if (value) {
      this.values = Object.entries(value).filter(val => FIELDS_FOR_DISPLAY.includes(val[0] as keyof GoogleUser));
    }
  }

  constructor() { }

  ngOnInit(): void {
  }


}
