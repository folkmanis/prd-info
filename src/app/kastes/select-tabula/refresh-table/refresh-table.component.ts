import { Component, OnInit } from '@angular/core';
import { KastesTabulaService } from '../../services/kastes-tabula.service';

@Component({
  selector: 'app-refresh-table',
  templateUrl: './refresh-table.component.html',
  styleUrls: ['./refresh-table.component.css']
})
export class RefreshTableComponent implements OnInit {

  constructor(
    private tabulaService: KastesTabulaService,
  ) { }

  reload$ = this.tabulaService.reloadKastes$;

  ngOnInit(): void {
  }

}
