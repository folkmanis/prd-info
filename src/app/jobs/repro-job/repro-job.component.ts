import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobQueryFilter } from 'src/app/interfaces/job';
import { LayoutService } from 'src/app/layout/layout.service';
import { JobService } from 'src/app/services/job.service';
import { FileUploadService } from './services/file-upload.service';

const MAX_JOB_NAME_LENGTH = 100; // TODO take from global config

@Component({
  selector: 'app-repro-job',
  templateUrl: './repro-job.component.html',
  styleUrls: ['./repro-job.component.scss']
})
export class ReproJobComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
