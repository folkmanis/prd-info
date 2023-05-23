import { Directive, Input, ViewContainerRef, TemplateRef, EmbeddedViewRef } from '@angular/core';

interface DataWithUnits {
  _id: string;
  units: string;
}

class UnitsDirectiveContext {
  constructor(
    public $implicit: string,
  ) { }
}

@Directive({
  selector: '[appMaterialUnits][appMaterialUnitsOf]',
  standalone: true,
})
export class MaterialUnitsDirective {

  private _units: DataWithUnits[] = [];
  @Input('appMaterialUnitsOf') set units(value: DataWithUnits[]) {
    this._units = Array.isArray(value) ? value : [];
    this.createView();
  }
  get units() {
    return this._units;
  }

  private _id: string;
  @Input('appMaterialUnitsId') set id(value: string) {
    this._id = value;
    this.createView();
  }
  get id() {
    return this._id;
  }

  private view: EmbeddedViewRef<UnitsDirectiveContext> | undefined;

  constructor(
    private templateRef: TemplateRef<UnitsDirectiveContext>,
    private containerRef: ViewContainerRef,
  ) { }

  private createView() {
    if (!this.units || !this.id) {
      return;
    }
    if (!this.view) {
      this.view = this.containerRef.createEmbeddedView(this.templateRef);
    }
    this.view.context = new UnitsDirectiveContext(this.unit());
  }

  private unit(): string {
    const material = this.units.find(un => un._id === this.id);
    return material?.units || '';
  }

  static ngTemplateContextGuard(dir: MaterialUnitsDirective, ctx: unknown): ctx is UnitsDirectiveContext {
    return true;
  }

}
