import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { USER_MODULES } from '../../user-modules';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  title$: Subject<string> = new Subject();

  constructor() { }
  /**
   * Uzliek virsrakstu
   * @param val Virsraksts
   */
  setTitle(val: string) {
    this.title$.next(val);
  }
  /**
   * Uzliek virsrakstu pēc moduļa nosaukuma
   * @param mod Moduļa nosaukums
   */
  setModule(mod: string) {
    this.setTitle(USER_MODULES.find(m => m.value === mod).description);
  }
}
