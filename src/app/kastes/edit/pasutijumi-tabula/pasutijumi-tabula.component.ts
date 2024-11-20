import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { KastesJobPartial } from '../../interfaces';
import { KastesPasutijumiService } from '../../services/kastes-pasutijumi.service';
import { kastesPreferences } from '../../services/kastes-preferences.service';

@Component({
    selector: 'app-pasutijumi-tabula',
    templateUrl: './pasutijumi-tabula.component.html',
    styleUrls: ['./pasutijumi-tabula.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatTableModule, MatIconModule, SimpleListContainerComponent, RouterLink, RouterLinkActive, DatePipe]
})
export class PasutijumiTabulaComponent {
  private kastesPasutijumiService = inject(KastesPasutijumiService);

  private filter = computed(() => (this.name().trim().length > 0 ? { name: this.name().trim() } : {}), { equal: isEqual });

  readonly columns = ['active', 'jobId', 'name', 'receivedDate', 'dueDate'];
  readonly columnsActive = ['active', 'jobId', 'name'];

  kastesJobs = signal<KastesJobPartial[]>([]);

  activeJob = kastesPreferences('pasutijums');

  name = signal('');

  constructor() {
    effect(
      async () => {
        const jobs = await firstValueFrom(this.kastesPasutijumiService.getKastesJobs(this.filter()));
        this.kastesJobs.set(jobs);
      },
      { allowSignalWrites: true },
    );
  }
}
