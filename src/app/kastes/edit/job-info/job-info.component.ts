import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { KastesJob, Veikals } from 'src/app/kastes/interfaces';
import {
  ColorTotalsComponent,
  KastesTotalsComponent,
  colorTotalsFromVeikali,
  jobProductsToColorTotals,
  kastesTotalsFromVeikali,
} from '../../common';
import { PasutijumsEditComponent } from '../pasutijums-edit/pasutijums-edit.component';

@Component({
  selector: 'app-job-info',
  standalone: true,
  templateUrl: './job-info.component.html',
  styleUrls: ['./job-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ColorTotalsComponent,
    MatButtonModule,
    RouterLink,
    KastesTotalsComponent,
    DatePipe,
  ],
})
export class JobInfoComponent {

  private pasutijumsEdit = inject(PasutijumsEditComponent);

  job = input.required<KastesJob>();

  veikali = input.required<Veikals[]>();

  activeJobId = input.required<number>();

  plannedTotals = computed(() => jobProductsToColorTotals(this.job().products || []));

  colorTotals = computed(() => colorTotalsFromVeikali(this.veikali()));

  kastesTotals = computed(() => kastesTotalsFromVeikali(this.veikali()));

  onSetAsActive() {
    this.pasutijumsEdit.setAsActive();
  }

  onDeleteVeikali() {
    this.pasutijumsEdit.deleteVeikali();
  }

  onCopyToFirebase() {
    this.pasutijumsEdit.copyToFirebase();
  }

  onCopyFromFirebase() {
    this.pasutijumsEdit.copyFromFirebase();
  }

}
