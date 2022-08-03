import { Output, ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { DropFolder } from 'src/app/interfaces';
import { FormControl } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { map, merge } from 'rxjs';

@Component({
  selector: 'app-drop-folder',
  templateUrl: './drop-folder.component.html',
  styleUrls: ['./drop-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropFolderComponent implements OnInit {

  folderControl = new FormControl<DropFolder>(null);

  folderActive = new FormControl<boolean>(true);

  private _folders: DropFolder[] = [];
  @Input() set folders(value: DropFolder[]) {
    this._folders = value || [];
    this.folderControl.setValue(this._folders[0]);
    this.setActive();
  }
  get folders() {
    return this._folders;
  }

  private _defaultEnabled = false;
  @Input() set defaultEnabled(value: any) {
    this._defaultEnabled = coerceBooleanProperty(value);
    this.setActive();
  }
  get defaultEnabled() {
    return this._defaultEnabled;
  }

  @Input() set folder(value: DropFolder) {
    this.folderControl.setValue(value);
  }
  get folder() {
    return this.folderActive.enabled && this.folderActive.value === true ? this.folderControl.value : null;
  }

  private _disabled = false;
  @Input() set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
    this.setActive();
  }
  get disabled(): boolean {
    return this._disabled;
  }

  @Output() folderChanges = merge(this.folderActive.valueChanges, this.folderControl.valueChanges).pipe(
    map(() => this.folder)
  );

  compareFn: (o1: DropFolder, o2: DropFolder) => boolean = (o1, o2) => o1?.path.join('/') === o2?.path.join('/');

  constructor() { }

  ngOnInit(): void {
  }

  private setActive() {
    this.folderActive.setValue(this._folders.length > 0 && this.defaultEnabled && !this.disabled);
    if (this._folders.length > 0 && !this.disabled) {
      this.folderActive.enable();
    } else {
      this.folderActive.disable();
    }

    if (this.disabled) {
      this.folderControl.disable();
    } else {
      this.folderControl.enable();
    }

  }

}
