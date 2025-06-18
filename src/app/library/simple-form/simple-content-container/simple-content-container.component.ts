import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { ScrollTopDirective } from '../../scroll-to-top/scroll-top.directive';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-simple-content-container',
  imports: [MatToolbar, MatIcon, MatMiniFabButton, RouterLink],
  templateUrl: './simple-content-container.component.html',
  styleUrl: './simple-content-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ScrollTopDirective],
})
export class SimpleContentContainerComponent {}
