import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { COLORS, VeikalsKaste } from 'src/app/kastes/interfaces';
import { AddressPackage } from '../../interfaces/address-package';
import { KastesApiService } from '../../services/kastes-api.service';
import { KastesPasutijumiService } from '../../services/kastes-pasutijumi.service';

@Injectable({
  providedIn: 'root',
})
export class KastesTabulaService {
  private api = inject(KastesApiService);

  private pasutijumiService = inject(KastesPasutijumiService);

  async getKastesJob(jobId: number) {
    return firstValueFrom(this.pasutijumiService.getKastesJob(jobId));
  }

  async getAddressPackages(jobId: number): Promise<AddressPackage[]> {

    if (!jobId) {
      return [];
    }

    const veikalsKastes = await firstValueFrom(this.api.getKastes(jobId));

    return veikalsKastes.map(veikalsKasteToAddressPackage);

  }

  async getBoxSizeQuantities(jobId: number): Promise<number[]> {
    if (!jobId) {
      return [];
    }
    return firstValueFrom(this.api.getApjomi(jobId));
  }

  async setCompleted(documentId: string, boxSequence: number, value: boolean): Promise<AddressPackage> {
    const veikalsKaste = await firstValueFrom(this.api.setGatavs({ _id: documentId, kaste: boxSequence }, value));
    return veikalsKasteToAddressPackage(veikalsKaste);
  }

  async setHaslabel(jobId: number, addressId: number): Promise<AddressPackage> {
    const veikalsKaste = await firstValueFrom(this.api.setLabel({ pasutijums: jobId, kods: addressId }));
    return veikalsKasteToAddressPackage(veikalsKaste);
  }

  replacePackage(packages: AddressPackage[], update: AddressPackage): AddressPackage[] {

    const idx = packages
      .findIndex((pack) =>
        pack.documentId === update.documentId
        && pack.boxSequence === update.boxSequence
      );

    if (idx > -1) {
      return [...packages.slice(0, idx), update, ...packages.slice(idx + 1)];
    } else {
      return [update, ...packages];
    }

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

  COLORS.forEach(color => addressPackage[color] = kastes[color]);

  return addressPackage;

}