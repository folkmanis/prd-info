import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { COLORS, pluckModifiedCount } from 'src/app/interfaces';
import { KastesJob } from 'src/app/jobs';
import { KastesUserPreferences, Veikals, VeikalsKaste, VeikalsUpload } from 'src/app/kastes/interfaces';
import { httpParams } from 'src/app/library';
import { z } from 'zod';
import { KastesJobPartial } from '../interfaces';
import { AddressPackage } from '../interfaces/address-package';

export const DEFAULT_USER_PREFERENCES: KastesUserPreferences = {
  pasutijums: null,
};

const KastesJobFilterSchema = z
  .object({
    name: z.string(),
  })
  .partial();
export type KastesJobFilter = z.infer<typeof KastesJobFilterSchema>;

@Service()
export class KastesApiService {
  private readonly path = getAppParams('apiPath') + 'kastes/';
  private http = inject(HttpClient);

  getAddressPackages(jobId: number): Observable<AddressPackage[]> {
    return this.http
      .get<VeikalsKaste[]>(this.path + jobId)
      .pipe(map((data) => data.map((row) => veikalsKasteToAddressPackage(row))));
  }

  getVeikali(jobId: number): Observable<Veikals[]> {
    return this.http.get<Veikals[]>(this.path + 'veikali/' + jobId);
  }

  getBoxSizeQuantities(jobId: number): Observable<number[]> {
    return this.http.get<number[]>(this.path + jobId + '/apjomi');
  }

  userPreferencesResource() {
    return httpResource<KastesUserPreferences>(() => this.path + 'preferences', {
      defaultValue: DEFAULT_USER_PREFERENCES,
    });
  }

  setUserPreferences(prefs: Partial<KastesUserPreferences>): Observable<KastesUserPreferences> {
    return this.http.patch<KastesUserPreferences>(this.path + 'preferences', prefs);
  }

  setCompleteState(
    { documentId, boxSequence }: Pick<AddressPackage, 'documentId' | 'boxSequence'>,
    state: boolean,
  ): Observable<AddressPackage> {
    // `192.168.8.73:4030/data/kastes/60f9214bf0b8622f7cedccaa/0/gatavs/false`
    const path = `${this.path}${documentId}/${boxSequence}/gatavs/${state}`;
    return this.http.patch<VeikalsKaste>(path, {}).pipe(map((data) => veikalsKasteToAddressPackage(data)));
  }

  setHasLabel(jobId: number, addressId: number): Observable<AddressPackage> {
    const path = `${this.path}${jobId}/${addressId}/label`;
    return this.http.patch<VeikalsKaste>(path, {}).pipe(map((data) => veikalsKasteToAddressPackage(data)));
  }

  putTable(veikali: VeikalsUpload[]): Observable<number> {
    return this.http.put(this.path, veikali).pipe(pluckModifiedCount());
  }

  updateVeikals(veikali: Veikals): Observable<Veikals> {
    return this.http.patch<Veikals>(this.path + 'veikals', veikali);
  }

  deleteVeikali(pasutijumsId: number): Observable<number> {
    return this.http.delete<{ deletedCount: number }>(this.path + pasutijumsId).pipe(map((data) => data.deletedCount));
  }

  parseXlsx(form: FormData): Observable<(string | number)[][]> {
    return this.http.post<(string | number)[][]>(this.path + 'parseXlsx', form);
  }

  getAllKastesJobs(filter: KastesJobFilter) {
    const query = KastesJobFilterSchema.encode(filter);
    return this.http.get<KastesJobPartial[]>(this.path + 'jobs/', httpParams(query));
  }

  getOneKastesJob(jobId: number) {
    return this.http.get<KastesJob>(this.path + 'jobs/' + jobId);
  }

  postFirestoreUpload(jobId: number) {
    return this.http.post<{
      recordsUpdated: number;
      jobId: number;
      collection: string;
    }>(this.path + jobId + '/firestore/upload', null);
  }

  postFirestoreDownload(jobId: number): Observable<number> {
    return this.http.post(this.path + jobId + '/firestore/download', null).pipe(pluckModifiedCount());
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
