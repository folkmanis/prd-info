import { ViewContainerRef, ComponentRef, ComponentFactory } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PanelComponent } from 'src/app/interfaces';

export class Panel<C = PanelComponent> {
    private _component: ComponentRef<C>;
    private viewRef: ViewContainerRef | undefined;
    length$: BehaviorSubject<number>;
    // private _style: any;

    constructor(
        public readonly name: string,
    ) {
        this.length$ = new BehaviorSubject(0);
    }

    setView(view: ViewContainerRef) {
        this.viewRef = view;
        this.length$.next(this.viewRef.length);
    }

    addComponent(componentFactory: ComponentFactory<C>): ComponentRef<C> {
        if (!this.viewRef) { return; } // check for view
        this.clear();
        this._component = this.viewRef.createComponent(componentFactory);
        this._component.changeDetectorRef.detectChanges();
        this.length$.next(this.viewRef.length);
        return this._component;
    }

    clear() {
        this.viewRef.clear();
        this.length$.next(this.viewRef.length);
    }

    show() {
        this.viewRef.element.nativeElement.style.visibility = 'visible';
    }

    hide() {
        this.viewRef.element.nativeElement.style.visibility = 'hidden';
    }

}
