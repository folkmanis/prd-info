import { Directive, Output } from '@angular/core';
import { LayoutService } from 'src/app/services';

@Directive({
  selector: '[appViewSize]'
})
export class ViewSizeDirective {

  @Output('viewLarge') isLarge$ = this.layout.isLarge$;

  @Output('viewSmall') isSmall$ = this.layout.isSmall$;

  constructor(
    private layout: LayoutService,
  ) { }


}
