import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { UserModule } from 'src/app/interfaces';

@Component({
  selector: 'app-card-menu',
  standalone: true,
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
  ]
})
export class CardMenuComponent {

  @Input({ required: true }) modules: UserModule[] | null;

}
