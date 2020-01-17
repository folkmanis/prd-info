import { Component, OnInit } from '@angular/core';
import { SidenavService } from '../library/services/sidenav.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  items = [
    {
      name: 'Lietotāji',
      route: 'users',
    }
  ];
  activeLink = null;
  constructor(
    private sidenavService: SidenavService,
  ) { }

  ngOnInit() {
    this.sidenavService.setTitle('Sistēmas iestatījumi');
  }

}
