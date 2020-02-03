import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModule } from '../user-module-interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.css']
})
export class CardMenuComponent implements OnInit {
  /**
   * saraksts ar moduļiem
   */
  @Input() modules: Observable<UserModule[]>;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    console.log(this.route.snapshot);
  }

}
