import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LibraryModule } from 'src/app/library/library.module';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';

import { MainMenuComponent } from './main-menu/main-menu.component';
import { MessagesListComponent } from './messaging/messages-list/messages-list.component';
import { MessagesTriggerDirective } from './messaging/messages-trigger.directive';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AppContainerComponent } from './app-container/app-container.component';



@NgModule({
  declarations: [
    ToolbarComponent,
    SideMenuComponent,
    MainMenuComponent,
    MessagesListComponent,
    MessagesTriggerDirective,
    AppContainerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    LibraryModule,
    MaterialLibraryModule,
  ],
  exports: [
    ToolbarComponent,
    SideMenuComponent,
    MainMenuComponent,
  ]
})
export class LayoutModule { }
