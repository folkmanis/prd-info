import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/layout.service';

@Component({
  selector: 'app-kastes',
  templateUrl: './kastes.component.html',
  styleUrls: ['./kastes.component.css']
})
export class KastesComponent implements OnInit {

  constructor(
    private layoutService: LayoutService,
  ) { }

  scrollable = this.layoutService.mainContainer;

  ngOnInit() {
  }

}
