import { ViewContainerRef, ComponentRef, ComponentFactory } from '@angular/core';
import { PanelComponent } from 'src/app/interfaces';

export class Panel<C = PanelComponent> {
    private _component: ComponentRef<C>;
    // private _style: any;

    constructor(
        public readonly name: string,
        private readonly viewRef: ViewContainerRef,
    ) {
        console.log('panel created', name, viewRef);
    }

    addComponent(componentFactory: ComponentFactory<C>): ComponentRef<C> {
        this.clear();
        this._component = this.viewRef.createComponent(componentFactory);
        return this._component;
    }

    clear() {
        this.viewRef.clear();
    }

    show() {
        this.viewRef.element.nativeElement.style.visibility = 'visible';
    }

    hide() {
        this.viewRef.element.nativeElement.style.visibility = 'hidden';
    }

}
