import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '../../library/guards/can-deactivate.guard';
import { LogfileService } from '../services/logfile.service';

@Component({
  selector: 'app-logfile',
  templateUrl: './logfile.component.html',
  styleUrls: ['./logfile.component.css'],
  providers: [LogfileService],
})
export class LogfileComponent implements OnInit, CanComponentDeactivate {

  constructor(
  ) { }

  ngOnInit(): void {
  }

  canDeactivate(): boolean | Observable<boolean> {
    return true;
  }

}
