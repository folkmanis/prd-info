import { ChangeDetectionStrategy, Component, Input, OnInit, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { IControlValueAccessor } from '@rxweb/types';


@Component({
  selector: 'app-folder-path',
  templateUrl: './folder-path.component.html',
  styleUrls: ['./folder-path.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderPathComponent implements OnInit, IControlValueAccessor<string[]> {
  @Input() set defaultPath(val: string[]) {
    this._defaultPath = val;
    console.log('input', val, this.path, this.initialPath, this.checked);
    if (!this.path || !this.initialPath || !this.checked) {
      this.path = this.defaultPath;
      if (this.checked) {
        this.setValueFn(this.path);
      }
    }
  }
  get defaultPath(): string[] { return this._defaultPath; }
  private _defaultPath: string[] = [];

  set checked(val: boolean) { this._checked = val; }
  get checked(): boolean { return this._checked; }
  private _checked = false;

  isDisabled = false;
  path: string[] | undefined;
  initialPath: string[] | undefined;

  setValueFn: (val: string[]) => void;

  constructor(
    @Self() private ngControl: NgControl,
  ) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: string[]) {
    console.log('writeValue');
    if (!this.initialPath) { this.initialPath = obj; }
    this.path = obj || this.defaultPath;
    this.checked = obj && obj.length > 0;
  }

  registerOnChange(fn: (val: string[]) => void) {
    this.setValueFn = fn;
  }

  registerOnTouched(fn: any) {
  }

  setDisabledState(isDisabled: boolean) {
    console.log('setDisabledState');
    this.isDisabled = isDisabled;
  }

  onChange({ checked }: MatCheckboxChange) {
    this.checked = checked;
    this.setValueFn(this.checked ? this.path : undefined);
  }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  get pathname(): string {
    return this.path?.join('/') || '';
  }


}
