import { ChangeDetectionStrategy, Component, inject, TrackByFunction } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RouteSheetService } from '../../services/route-sheet.service';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { TransportationRouteSheet } from '../../interfaces/transportation-route-sheet';

@Component({
    selector: 'app-route-sheet-list',
    imports: [MatTableModule, RouterLink, RouterLinkActive, SimpleListContainerComponent],
    templateUrl: './route-sheet-list.component.html',
    styleUrl: './route-sheet-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteSheetListComponent {
  private routeSheetService = inject(RouteSheetService);
  routeSheets = this.routeSheetService.routeSheets;

  displayedColumns = ['month-year', 'driver', 'licencePlate']; // , 'totalKm'
  trackByFn: TrackByFunction<TransportationRouteSheet> = (_, route) => route._id;

  constructor() {
    this.routeSheetService.setFilter({});
  }
}
