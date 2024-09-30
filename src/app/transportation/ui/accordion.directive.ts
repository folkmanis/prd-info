import { afterNextRender, contentChildren, Directive, inject, Injector, viewChildren } from '@angular/core';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';

@Directive({
  selector: 'mat-accordion[app-accordion]',
  standalone: true,
})
export class AccordionDirective {
  private accordion = inject(MatAccordion, { host: true });
  private tripPanels = contentChildren(MatExpansionPanel);
  private injector = inject(Injector);

  expandLast() {
    afterNextRender(
      () => {
        const panels = this.tripPanels();
        if (panels.length > 0) {
          panels[panels.length - 1].open();
        }
      },
      { injector: this.injector },
    );
  }

  closeAll() {
    afterNextRender(
      () => {
        this.accordion.closeAll();
      },
      { injector: this.injector },
    );
  }
}
