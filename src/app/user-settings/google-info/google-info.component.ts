import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { GoogleUser } from 'src/app/interfaces';

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
  standalone: true,
  templateUrl: './google-info.component.html',
  styleUrls: ['./google-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, TitleCasePipe],
})
export class GoogleInfoComponent {
  values: [string, string][] = [];

  @Input() set googleInfo(value: GoogleUser) {
    if (value) {
      this.values = Object.entries(value).filter((val) =>
        FIELDS_FOR_DISPLAY.includes(val[0] as keyof GoogleUser)
      );
    }
  }

  @Output('valueClicked') clickEvent = new EventEmitter<[string, string]>();
}
