import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AddressPackage } from '../interfaces/address-package';
import { KastesApiService } from './kastes-api.service';
import { KastesPasutijumiService } from './kastes-pasutijumi.service';

@Injectable({
  providedIn: 'root',
})
export class PackingTableService {
  private api = inject(KastesApiService);

  private pasutijumiService = inject(KastesPasutijumiService);

  async getKastesJob(jobId: number) {
    return this.pasutijumiService.getKastesJob(jobId);
  }

  async getAddressPackages(jobId: number): Promise<AddressPackage[]> {
    if (!jobId) {
      return [];
    }

    return firstValueFrom(this.api.getAddressPackages(jobId));
  }

  async getBoxSizeQuantities(jobId: number): Promise<number[]> {
    if (!jobId) {
      return [];
    }
    return firstValueFrom(this.api.getBoxSizeQuantities(jobId));
  }

  async setCompleted(documentId: string, boxSequence: number, value: boolean): Promise<AddressPackage> {
    return firstValueFrom(this.api.setCompleteState({ documentId, boxSequence }, value));
  }

  async setHaslabel(jobId: number, addressId: number): Promise<AddressPackage> {
    return firstValueFrom(this.api.setHasLabel(jobId, addressId));
  }

  replacePackage(packages: AddressPackage[], update: AddressPackage): AddressPackage[] {
    const idx = packages.findIndex((pack) => pack.documentId === update.documentId && pack.boxSequence === update.boxSequence);

    if (idx > -1) {
      return [...packages.slice(0, idx), update, ...packages.slice(idx + 1)];
    } else {
      return [update, ...packages];
    }
  }
}
