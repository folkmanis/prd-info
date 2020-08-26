import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, map, switchMap, filter } from 'rxjs/operators';
import { PasutijumiService } from '../../services/pasutijumi.service';
import { KastesOrder } from 'src/app/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pasutijums-id',
  templateUrl: './pasutijums-id.component.html',
  styleUrls: ['./pasutijums-id.component.css']
})
export class PasutijumsIdComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private pasService: PasutijumiService,
  ) { }

  order$: Observable<KastesOrder> = this.route.paramMap.pipe(
    map(params => params.get('id')),
    filter((id: string | undefined) => id && id.length === 24),
    switchMap(id => this.pasService.getPasutijums(id)),
  );

  ngOnInit(): void {
  }

}
