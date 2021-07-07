import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Material } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { MaterialsService } from '../services/materials.service';

@Component({
  selector: 'app-materials-list',
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'category',];

  materials$: Observable<Partial<Material>[]> = this.materialsService.materials$;
  large$ = this.layout.isLarge$;

  constructor(
    private materialsService: MaterialsService,
    private layout: LayoutService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.materialsService.reload();
  }

}
