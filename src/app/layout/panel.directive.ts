import { Directive, OnInit, ViewContainerRef, Input } from '@angular/core';
import { LayoutService } from './layout.service';

@Directive({
  selector: '[appPanel]'
})
export class PanelDirective implements OnInit {
  @Input('appPanel') private panelName: string;

  constructor(
    private service: LayoutService,
    private view: ViewContainerRef,
  ) { }

  ngOnInit(): void {
    if (this.panelName) {
      this.service.getPanel(this.panelName).setView(this.view);
    }
  }

}
