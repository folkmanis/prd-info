import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}
