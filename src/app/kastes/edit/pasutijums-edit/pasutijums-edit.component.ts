import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { KastesJob } from 'src/app/interfaces';

@Component({
  selector: 'app-pasutijums-edit',
  templateUrl: './pasutijums-edit.component.html',
  styleUrls: ['./pasutijums-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasutijumsEditComponent implements OnInit {

  constructor() { }

  kastesJob: KastesJob | undefined;

  ngOnInit(): void {
  }

  onData(data: KastesJob): void {
    this.kastesJob = data;
  }

}
