import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../library/services/sidenav.service';

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.css']
})
export class UserPreferencesComponent implements OnInit {

  constructor(
    private sidenavService: SidenavService,
  ) { }

  ngOnInit() {
    this.sidenavService.setModule('user-preferences');
  }

}
