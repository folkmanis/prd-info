import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { KastesUserPreferences, Veikals, VeikalsKaste, VeikalsUpload } from 'src/app/kastes/interfaces';
import { COLORS } from 'src/app/interfaces';
import { HttpOptions } from 'src/app/library/http';
import { KastesJobPartial } from '../interfaces';
import { AddressPackage } from '../interfaces/address-package';
import { KastesJob } from 'src/app/jobs';

export const DEFAULT_USER_PREFERENCES: KastesUserPreferences = {
  pasutijums: null,
};

@Injectable({
  providedIn: 'root',
})
export class KastesApiService {
  private readonly path = getAppParams('apiPath') + 'kastes/';
  private http = inject(HttpClient);

  getAddressPackages(jobId: number): Observable<AddressPackage[]> {
    const options = new HttpOptions();
    return this.http.get<VeikalsKaste[]>(this.path + jobId, options).pipe(map((data) => data.map((row) => veikalsKasteToAddressPackage(row))));
  }

  getVeikali(jobId: number): Observable<Veikals[]> {
    return this.http.get<Veikals[]>(this.path + 'veikali/' + jobId, new HttpOptions());
  }

  getBoxSizeQuantities(jobId: number): Observable<number[]> {
    return this.http.get<number[]>(this.path + jobId + '/apjomi', new HttpOptions());
  }

  userPreferences() {
    return httpResource<KastesUserPreferences>(this.path + 'preferences', { defaultValue: DEFAULT_USER_PREFERENCES });
  }

  setUserPreferences(prefs: Partial<KastesUserPreferences>): Observable<KastesUserPreferences> {
    return this.http.patch<KastesUserPreferences>(this.path + 'preferences', prefs, new HttpOptions());
  }

  setCompleteState({ documentId, boxSequence }: Pick<AddressPackage, 'documentId' | 'boxSequence'>, state: boolean): Observable<AddressPackage> {
    // `192.168.8.73:4030/data/kastes/60f9214bf0b8622f7cedccaa/0/gatavs/false`
    const path = `${this.path}${documentId}/${boxSequence}/gatavs/${state}`;
    return this.http.patch<VeikalsKaste>(path, {}, new HttpOptions()).pipe(map((data) => veikalsKasteToAddressPackage(data)));
  }

  setHasLabel(jobId: number, addressId: number): Observable<AddressPackage> {
    const path = `${this.path}${jobId}/${addressId}/label`;
    return this.http.patch<VeikalsKaste>(path, {}, new HttpOptions()).pipe(map((data) => veikalsKasteToAddressPackage(data)));
  }

  putTable(veikali: VeikalsUpload[]): Observable<number> {
    return this.http.put<{ modifiedCount: number }>(this.path, veikali, new HttpOptions()).pipe(map((data) => data.modifiedCount));
  }

  updateVeikals(veikali: Veikals): Observable<Veikals> {
    return this.http.patch<Veikals>(this.path + 'veikals', veikali, new HttpOptions());
  }

  deleteVeikali(pasutijumsId: number): Observable<number> {
    return this.http.delete<{ deletedCount: number }>(this.path + pasutijumsId, new HttpOptions()).pipe(map((data) => data.deletedCount));
  }

  parseXlsx(form: FormData): Observable<Array<string | number>[]> {
    return this.http.post<Array<string | number>[]>(this.path + 'parseXlsx', form);
  }

  getAllKastesJobs(filter: Record<string, any>) {
    return this.http.get<KastesJobPartial[]>(this.path + 'jobs/', new HttpOptions(filter));
  }

  getOneKastesJob(jobId: number) {
    return this.http.get<KastesJob>(this.path + 'jobs/' + jobId, new HttpOptions());
  }

  postFirestoreUpload(jobId: number) {
    return this.http.post<{
      recordsUpdated: number;
      jobId: number;
      collection: string;
    }>(this.path + jobId + '/firestore/upload', null, new HttpOptions());
  }

  postFirestoreDownload(jobId: number) {
    return this.http.post<{
      modifiedCount: number;
    }>(this.path + jobId + '/firestore/download', null, new HttpOptions());
  }
}

function veikalsKasteToAddressPackage({ kastes, ...veikals }: VeikalsKaste): AddressPackage {
  const addressPackage = {
    address: veikals.adrese,
    addressId: veikals.kods,
    boxSequence: veikals.kaste,
    completed: kastes.gatavs,
    documentId: veikals._id,
    hasLabel: kastes.uzlime,
    total: kastes.total,
  } as AddressPackage;

  COLORS.forEach((color) => (addressPackage[color] = kastes[color]));

  return addressPackage;
}
