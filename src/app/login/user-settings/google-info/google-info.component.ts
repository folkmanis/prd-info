import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { GoogleUser } from 'src/app/interfaces';
import { JobsUserPreferencesService } from 'src/app/jobs/services/jobs-user-preferences.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GmailService } from 'src/app/jobs/gmail/services/gmail.service';
import { JobsUserPreferences } from 'src/app/jobs/interfaces/jobs-user-preferences';
import { LabelListItem } from 'src/app/jobs/gmail/interfaces';


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

  @Output('valueClicked') clickEvent = new EventEmitter<[string, string]>();



  constructor(
    private userPreferences: JobsUserPreferencesService,
    private gmail: GmailService,
  ) { }

  ngOnInit(): void {
  }



}
