import { Directive, Input, Output } from '@angular/core';
import { ReproJobService } from '../services/repro-job.service';


@Directive({
  selector: '[appActiveProduct]'
})
export class ActiveProductDirective {

  @Input('appActiveProduct') set product(value: string | null) {
    this.reproJobService.setActiveProduct(value);
  }

  @Output('appActiveProductChange') productChange = this.reproJobService.activeProducts();

  constructor(
    private reproJobService: ReproJobService,
  ) { }

}
