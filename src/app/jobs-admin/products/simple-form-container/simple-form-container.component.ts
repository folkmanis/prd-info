import {
  Component, OnInit, OnDestroy,
  ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ComponentFactory, AfterViewInit, Type,
  AfterViewChecked, ChangeDetectorRef
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { SimpleFormDirective } from '../../services/simple-form.directive';
import { ProductsEditorComponent } from '../products-editor/products-editor.component';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const COMPONENT: Type<any> = ProductsEditorComponent;

@Component({
  selector: 'app-simple-form-container',
  templateUrl: './simple-form-container.component.html',
  styleUrls: ['./simple-form-container.component.scss']
})
export class SimpleFormContainerComponent implements OnInit, OnDestroy, CanComponentDeactivate, AfterViewInit, AfterViewChecked {
  @ViewChild('formContent', { read: ViewContainerRef }) set formContainer(container: ViewContainerRef) {
    this.formComponent = container.createComponent<SimpleFormDirective<any>>(this._factory);
    this._subs.add(
      this.value$.subscribe(val => { this.formComponent.instance.initialValue = val; console.log(val); })
    );
    console.log(this.form);
  }

  constructor(
    private resolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
  ) { }
  private _factory: ComponentFactory<SimpleFormDirective<any>>;
  private _subs = new Subscription();

  formComponent: ComponentRef<SimpleFormDirective<any>>;

  get form(): AbstractControl {
    return this.formComponent?.instance.form;
  }

  value$ = this.route.data.pipe(map(data => data.value));

  ngOnInit(): void {
    this._factory = this.resolver.resolveComponentFactory(COMPONENT);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  ngAfterViewInit() {
    console.log('after view init');
  }

  ngAfterViewChecked() {
    console.log('after view checked');
  }

  onSave(): void {
    this.formComponent.instance.onSave();
  }
  onReset(): void {
    this.formComponent.instance.onReset();
  }
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.formComponent.instance.canDeactivate();
  }

}
