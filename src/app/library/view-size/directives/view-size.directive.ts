import { Directive, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutService } from '../layout.service';

@Directive({
  selector: '[appViewSize]',
  exportAs: 'viewSize',
  standalone: true,
  host: {
    '[class.large]': 'isLarge()',
    '[class.medium]': 'isMedium()',
    '[class.small]': 'isSmall()',
  },
})
export class ViewSizeDirective {
  private layoutService = inject(LayoutService);

  isLarge = toSignal(this.layoutService.matches('large'), { requireSync: true });

  isMedium = toSignal(this.layoutService.matches('medium'), { requireSync: true });

  isSmall = toSignal(this.layoutService.matches('small'), { requireSync: true });
}
