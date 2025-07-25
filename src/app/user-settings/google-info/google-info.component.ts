import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { GoogleUser } from 'src/app/interfaces';

const FIELDS_FOR_DISPLAY: (keyof GoogleUser)[] = ['id', 'email', 'name', 'given_name', 'family_name', 'gender', 'locale'];

@Component({
  selector: 'app-google-info',
  templateUrl: './google-info.component.html',
  styleUrls: ['./google-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, TitleCasePipe],
})
export class GoogleInfoComponent {
  values = computed(() => {
    return Object.entries(this.googleInfo() || {}).filter((val) => FIELDS_FOR_DISPLAY.includes(val[0] as keyof GoogleUser)) as [
      (typeof FIELDS_FOR_DISPLAY)[number],
      string | boolean,
    ][];
  });

  googleInfo = input<GoogleUser>();

  clickEvent = output<[(typeof FIELDS_FOR_DISPLAY)[number], string | boolean]>({ alias: 'valueClicked' });
}
