import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LogfileService } from '../services/logfile.service';

@Component({
  selector: 'app-logfile',
  templateUrl: './logfile.component.html',
  styleUrls: ['./logfile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LogfileService],
})
export class LogfileComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
