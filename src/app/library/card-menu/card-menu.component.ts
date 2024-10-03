import { ChangeDetectionStrategy, Component, input, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { UserModule } from 'src/app/interfaces';

@Component({
  selector: 'app-card-menu',
  standalone: true,
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatCardModule],
})
export class CardMenuComponent {
  modules = input.required<UserModule[] | null>();
}
