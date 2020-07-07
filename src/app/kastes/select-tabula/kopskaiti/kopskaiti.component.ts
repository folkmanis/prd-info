import { Component, OnInit } from '@angular/core';
import { KastesTabulaService } from '../../services/kastes-tabula.service';
import { Observable } from 'rxjs';
import { Totals } from '../../interfaces';

@Component({
  selector: 'app-kopskaiti',
  templateUrl: './kopskaiti.component.html',
  styleUrls: ['./kopskaiti.component.css']
})
export class KopskaitiComponent implements OnInit {

  constructor(
    private tabulaService: KastesTabulaService,
  ) { }
  totals$: Observable<Totals> = this.tabulaService.totals$;

  ngOnInit(): void {
  }

}
