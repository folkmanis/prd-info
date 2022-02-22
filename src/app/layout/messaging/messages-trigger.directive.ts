import { CdkOverlayOrigin, ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, ElementRef, HostListener, Injector, OnDestroy, OnInit } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { takeUntil } from 'rxjs/operators';
import { MessagesListComponent } from './messages-list/messages-list.component';

@Directive({
  selector: 'button[appMessagesTrigger]',
  providers: [DestroyService],
})
export class MessagesTriggerDirective extends CdkOverlayOrigin implements OnInit, OnDestroy {

  private overlayRef: OverlayRef;

  private readonly connectedPositions: ConnectedPosition[] = [
    {
      offsetX: 10,
      offsetY: 0,
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    }
  ];

  @HostListener('click')
  onClick() {
    this.overlayRef.hasAttached() ? this.overlayRef.detach() : this.openOverlay();
  }

  constructor(
    private overlay: Overlay,
    elementRef: ElementRef,
    private destroy$: DestroyService,
  ) {
    super(elementRef);
  }

  ngOnInit() {

    const config = this.overlayConfig();
    this.overlayRef = this.overlay.create(config);

    this.overlayRef.backdropClick().pipe(
      takeUntil(this.destroy$),
    )
      .subscribe(event => {
        event.stopPropagation();
        event.preventDefault();
        this.overlayRef.detach();
      });
  }

  ngOnDestroy(): void {
    this.overlayRef.detach();
  }

  openOverlay() {
    const injector = Injector.create({
      providers: [{ provide: OverlayRef, useValue: this.overlayRef }]
    });
    const portal = new ComponentPortal(MessagesListComponent, undefined, injector);
    this.overlayRef.attach(portal);
  }

  private overlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions(this.connectedPositions)
        .withGrowAfterOpen()
        .withLockedPosition(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      width: '320px',
      hasBackdrop: true,
      backdropClass: ['cdk-overlay-transparent-backdrop'],
      panelClass: ['mat-elevation-z4', 'app-messages-pane'],
    });
  }

}
