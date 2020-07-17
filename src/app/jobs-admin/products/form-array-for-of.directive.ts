import { Directive, Input, ViewContainerRef, TemplateRef, DoCheck } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

export class AppFormArrayForContext {
  constructor(
    public $implicit: FormGroup,
    public index: number,
    public count: number,
  ) { }

  get data(): { [key: string]: any; } {
    return this.$implicit.value;
  }
}

@Directive({
  selector: '[appFormArrayForOf]'
})
export class FormArrayForOfDirective implements DoCheck {
  @Input() set appFormArrayForOf(_arr: FormArray) {
    if (_arr) {
      this._formArray = _arr;
      this.formArrayChanged = true;
    }
  }

  private _formArray: FormArray;
  private formArrayChanged = false;
  private count = 0;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _template: TemplateRef<AppFormArrayForContext>,
  ) { }

  ngDoCheck(): void {
    if (this.formArrayChanged) {
      this._setTemplates();
      this.formArrayChanged = false;
    }
    if (this._formArray.controls.length !== this.count) {
      this._setTemplates();
    }
  }

  private _setTemplates(): void {
    this.count = this._formArray.controls.length;
    const controls = this._formArray.controls as FormGroup[];
    this._viewContainerRef.clear();
    controls.forEach((frm, idx) =>
      this._viewContainerRef.createEmbeddedView(
        this._template,
        new AppFormArrayForContext(frm, idx, controls.length)
      )
    );
  }

}
