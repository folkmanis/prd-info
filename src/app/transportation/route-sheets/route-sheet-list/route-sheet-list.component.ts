import { Component, inject, TrackByFunction } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { nonNullResource } from 'src/app/library/signals';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { RouteSheet } from '../schemas';
import { RouteSheetService } from '../services/route-sheet.service';

@Component({
  selector: 'app-route-sheet-list',
  imports: [MatTableModule, RouterLink, RouterLinkActive, SimpleListContainerComponent],
  templateUrl: './route-sheet-list.component.html',
  styleUrl: './route-sheet-list.component.scss',
})
export class RouteSheetListComponent {
  #resource = inject(RouteSheetService).getRouteSheetsResource();
  protected routeSheets = nonNullResource(this.#resource, []);

  displayedColumns = ['month-year', 'driver', 'licencePlate']; // , 'totalKm'
  trackByFn: TrackByFunction<RouteSheet> = (_, route) => route._id;

  onReload() {
    this.#resource.reload();
  }
}
