import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';


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

  updateJobFolderPathControl = new UntypedFormControl({ value: true, disabled: true });

  @Input() set updatePath(value: boolean) {
    value = coerceBooleanProperty(value);
    this.updateJobFolderPathControl.setValue(value);
  }
  get updatePath(): boolean {
    return this.enabled && this.updateJobFolderPathControl.value;
  }


  @Input() set enabled(value: any) {
    value = coerceBooleanProperty(value);
    if (value === true) {
      this.updateJobFolderPathControl.enable();
    } else {
      this.updateJobFolderPathControl.disable();
    }
  }
  get enabled() {
    return this.updateJobFolderPathControl.enabled;
  }

  @Output() createFolder = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
