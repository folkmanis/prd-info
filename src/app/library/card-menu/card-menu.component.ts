import { Component, Input } from '@angular/core';
import { UserModule } from 'src/app/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.css']
})
export class CardMenuComponent {
  /**
   * saraksts ar moduļiem
   */
  @Input() modules: UserModule[];

  constructor() { }

}
