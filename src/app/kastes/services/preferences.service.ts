import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of, throwError, merge } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpService } from './http.service';
import { UserService } from './user.service';

export class Preferences {
  yellow?: string;
  rose?: string;
  white?: string;
  pasutijums?: number;
  pasutijumsHuman?: string;
}

export class Pasutijums {
  id: number;
  pasutijums: string;
}

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private static PrefrencesTableKeys = ['yellow', 'rose', 'white', 'pasutijums'];
  private prefs: Preferences;
  private pasutijumi: Pasutijums[] = [];
  private preferencesEmitter: EventEmitter<Preferences> = new EventEmitter<Preferences>();

  public redirect: string; // Ja izsauc route, tad šeit būs ceļš
  public preferencesObserver: Observable<Preferences> = merge(
    this.preferencesEmitter,
    this.getPreferences(),
  );

  constructor(
    private httpService: HttpService,
    private userService: UserService,
  ) { }

  getPreferences(): Observable<Preferences> {
    if (this.prefs) {
      return of(this.prefs);
    }
    return this.getPasutijumi()
    .pipe(
      switchMap(() => {
        return this.userService.getUser();
      }),
      switchMap((u) => {
        return this.httpService.getPreferencesHttp(u.id);
      }),
      map(pref => {  // TODO uztaisīt, lai neapstrādā atkārtoti, ja preferences gatavas
          pref.pasutijums = +pref.pasutijums;
          const pasId = this.pasutijumi.find((pas) => pas.id === pref.pasutijums);
          if (pasId) {
            pref.pasutijumsHuman = pasId.pasutijums;
          }
          return pref;
        }),
        tap(pref => {
          this.prefs = pref;
        }),
      );
  }

  setPreferences(setPrefs: Preferences): Observable<Preferences> {
    const uplPrefs = {};
    for (const key of PreferencesService.PrefrencesTableKeys) {  // Pārlasa masīvu, lai neaiziet kas lieks
      if (setPrefs.hasOwnProperty(key)) {
        uplPrefs[key] = setPrefs[key];
      }
    }
    return this.httpService.setPreferencesHttp(uplPrefs).pipe(
      switchMap(() => {
        this.prefs = null;
        return this.getPreferences();
      }),
      tap((p) => this.preferencesEmitter.emit(p))
    );
  }

  /**
   * Izsniedz pasūtījumu sarakstu kā Observable<Pasutijums[]>
   * Ja vienreiz jau saņemts, tad izsniedz saglabāto kopiju
   */
  getPasutijumi(dirty: boolean = false): Observable<Pasutijums[]> {
    if (this.pasutijumi.length && !dirty) {
      return of(this.pasutijumi);
    } else {
      return this.httpService.getPasutijumiHttp().pipe(
        map((pas) => {
          this.pasutijumi = pas;
          this.pasutijumi.push({ id: 0, pasutijums: 'Nav noteikts' });
          return this.pasutijumi;
        })
      );
    }
  }

  public getPasutijums(): Observable<number> {
    return this.getPreferences().pipe(map((pref) => pref.pasutijums));
  }

}
