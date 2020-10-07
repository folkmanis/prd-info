import { Component, OnInit, Input } from '@angular/core';
import { UserModule } from 'src/app/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.scss']
})
export class CardMenuComponent implements OnInit {
  /**
   * saraksts ar moduļiem
   */
  @Input() modules: UserModule[];

  constructor() { }

  ngOnInit() {
  }

}
