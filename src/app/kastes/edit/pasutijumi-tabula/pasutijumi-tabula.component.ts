import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { KastesPasutijumiService } from '../../services/kastes-pasutijumi.service';
import { kastesPreferences } from '../../services/kastes-preferences.service';

@Component({
  selector: 'app-pasutijumi-tabula',
  standalone: true,
  templateUrl: './pasutijumi-tabula.component.html',
  styleUrls: ['./pasutijumi-tabula.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatIconModule,
    SimpleListContainerComponent,
    RouterLink,
    RouterLinkActive,
    DatePipe,
  ],
})
export class PasutijumiTabulaComponent implements OnInit {

  private kastesPasutijumiService = inject(KastesPasutijumiService);

  readonly columns = ['active', 'jobId', 'name', 'receivedDate', 'dueDate'];
  readonly columnsActive = ['active', 'jobId', 'name'];

  activeJob = kastesPreferences('pasutijums');

  datasource$ = this.kastesPasutijumiService.kastesJobs$;


  ngOnInit(): void {
    this.kastesPasutijumiService.setFilter({});
  }

  onFilter(name: string): void {
    const filter = name.length > 0 ? { name } : {};
    this.kastesPasutijumiService.setFilter(filter);
  }
}
