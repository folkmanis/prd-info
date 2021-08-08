import { Input, Output, Directive, HostListener, ElementRef, ComponentRef, OnInit, OnDestroy } from '@angular/core';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { Overlay, FlexibleConnectedPositionStrategy, OverlayPositionBuilder, CdkOverlayOrigin, OverlayConfig, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { DestroyService } from 'prd-cdk';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: 'button[appMessagesTrigger]',
  providers: [DestroyService],
})
export class MessagesTriggerDirective implements OnInit { //  extends CdkOverlayOrigin

  private overlayRef: OverlayRef;
  private portal = new ComponentPortal(MessagesListComponent);

  private messagesComponentRef: ComponentRef<MessagesListComponent> | undefined;

  opened = false;

  private readonly connectedPoistions: ConnectedPosition[] = [
    {
      offsetX: 0,
      offsetY: 0,
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    }
  ];

  @HostListener('click') onClick() {
    this.opened ? this.closeOverlay() : this.openOverlay();
  }

  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef,
    private destroy$: DestroyService,
  ) {
    const config = this.getOveraylConfig();
    this.overlayRef = this.overlay.create(config);
  }

  ngOnInit() {
    this.overlayRef.backdropClick().pipe(
      takeUntil(this.destroy$),
    )
      .subscribe(event => {
        event.stopPropagation();
        event.preventDefault();
        this.closeOverlay();
      });
  }

  private getOveraylConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions(this.connectedPoistions)
        .withGrowAfterOpen()
        .withLockedPosition(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      width: '320px',
      hasBackdrop: true,
      backdropClass: ['cdk-overlay-transparent-backdrop'],
      panelClass: ['mat-elevation-z4']
    });
  }

  private openOverlay() {
    this.messagesComponentRef = this.overlayRef.attach(this.portal);
    this.messagesComponentRef.instance.dropDown = true;
    this.opened = true;
  }

  private closeOverlay() {
    this.overlayRef.detach();
    this.opened = false;
  }

}
