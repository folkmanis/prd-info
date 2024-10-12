import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { getAppParams } from '../app-params';
import { findModulesPath } from './system-preferences.service';

const DEFAULT_TITLE = 'Darbu meklētājs';

@Injectable({ providedIn: 'root' })
export class ModulePageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private userModules = getAppParams('userModules');

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot) ?? this.moduleTitle(snapshot.url);
    this.title.setTitle(title);
  }

  private moduleTitle(url: string) {
    const lastModule = findModulesPath(url, this.userModules).pop();
    return lastModule?.name ?? DEFAULT_TITLE;
  }
}
