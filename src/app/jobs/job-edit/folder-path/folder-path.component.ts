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
    this._defaultPath = val || [];
    if (!this.path || !this.initialPath || !this.checked) {
      this.path = this.defaultPath;
      this.updateCheckboxDisabledState();
      if (this.checked && pathToString(this.ngControl.control.value) !== this.pathname) {
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
  path: string[] = [];
  initialPath: string[] | undefined;

  setValueFn: (val: string[]) => void;

  constructor(
    @Self() private ngControl: NgControl,
  ) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: string[]) {
    if (!this.initialPath) { this.initialPath = obj; }
    this.path = obj || this.defaultPath;
    this.checked = obj && obj.length > 0;
    this.updateCheckboxDisabledState();
  }

  registerOnChange(fn: (val: string[]) => void) {
    this.setValueFn = fn;
  }

  registerOnTouched(fn: any) {
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  onChange({ checked }: MatCheckboxChange) {
    this.checked = checked;
    this.setValueFn(this.checked ? this.path : undefined);
  }

  ngOnInit(): void {
  }

  get pathname(): string {
    return pathToString(this.path);
  }

  updateCheckboxDisabledState(): void {
    this.isDisabled = !this.path.length;
    this.checked = this.checked && !this.isDisabled;
  }

}

function pathToString(path: string[] | undefined): string {
  return path?.join('/') || '';
}
