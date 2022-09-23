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

  gmailControl = new FormGroup({
    activeLabelId: new FormControl('', [Validators.required])
  });

  values: [string, string][] = [];

  @Input() set googleInfo(value: GoogleUser) {
    if (value) {
      this.values = Object.entries(value).filter(val => FIELDS_FOR_DISPLAY.includes(val[0] as keyof GoogleUser));
    }
  }

  @Output('valueClicked') clickEvent = new EventEmitter<[string, string]>();

  private _preferences: JobsUserPreferences;
  set preferences(value: JobsUserPreferences) {
    if (value instanceof JobsUserPreferences) {
      this._preferences = value;
      this.gmailControl.patchValue(value.gmail, { emitEvent: false });
    }
  }
  get preferences() {
    return {
      ...this._preferences,
      gmail: {
        ...this._preferences.gmail,
        ...this.gmailControl.value
      }
    };
  }

  labels$: Observable<LabelListItem[]>;


  constructor(
    private userPreferences: JobsUserPreferencesService,
    private gmail: GmailService,
  ) { }

  ngOnInit(): void {
    this.labels$ = this.gmail.labels();
    this.userPreferences.userPreferences$.pipe(
      take(1),
    ).subscribe(pref => this.preferences = pref);
  }

  onSave() {
    if (!this.gmailControl.valid || this.preferences == null) {
      return;
    }
    this.userPreferences.setUserPreferences(this.preferences).subscribe();
  }


}
