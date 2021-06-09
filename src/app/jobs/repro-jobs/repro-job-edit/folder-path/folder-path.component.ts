import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-folder-path',
  templateUrl: './folder-path.component.html',
  styleUrls: ['./folder-path.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderPathComponent implements OnInit {

  @Input() set path(path: string) {
    this._path = path || '';
  }
  get path(): string {
    return this._path;
  }
  private _path = '';

  @Output() createFolder = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
