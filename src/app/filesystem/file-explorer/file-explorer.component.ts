import { ChangeDetectionStrategy, Component, OnInit, Input, Output } from '@angular/core';
import { FileElement } from '../interfaces/file-element';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileExplorerComponent implements OnInit {

  @Input() title: string = '';

  @Input() files: FileElement[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
