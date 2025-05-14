import { Colors, COLORS } from 'src/app/interfaces';
import { MAX_ITEMS_BOX, SINGLE_ITEM_CONTENTS } from '../interfaces';
import { ColumnNames } from './column-names';

export interface AddressWithPackages {
  kods: number;
  adrese: string;
  kastes: AddressPackage[];
}

export type Totals = Record<Colors, number> & {
  packagesBySize: Array<[number, number]>;
  addresses: number;
  packages: number;
  items: number;
};

type AddressPackage = Record<Colors, number> & {
  total: number;
  gatavs: boolean;
  uzlime: boolean;
};

function addressPackage(): AddressPackage {
  const obj = {
    total: 0,
    gatavs: false,
    uzlime: false,
  };

  COLORS.forEach((color) => (obj[color] = 0));

  return obj as AddressPackage;
}

class SelectedFields {
  kods: number = 0;
  adrese: string = '';

  constructor() {
    COLORS.forEach((color) => (this[color] = 0));
  }
}

export function rawArrayToAddressWithPackage(rowArray: Array<string | number>[], columnMap: [number, ColumnNames][]): AddressWithPackages[] {
  const result: SelectedFields[] = [];

  rowArray.forEach((row) => {
    const fieldObject = rowToFieldsObject(row, columnMap);
    if (assertNotEmptyRecord(fieldObject)) {
      result.push(fieldObject);
    }
  });

  return result.map((fieldsObject) => packagesFromAdddress(fieldsObject));
}

export function addOrderId<T = AddressWithPackages>(addresesWithPackages: T[], orderId: number): Array<T & { pasutijums: number }> {
  return addresesWithPackages.map((address) => ({
    ...address,
    pasutijums: orderId,
  }));
}

export function totalsFromAddresesWithPackages(addressesWithPackages: AddressWithPackages[]): Totals {
  const totalColors = {} as Record<Colors, number>;
  COLORS.forEach((color) => (totalColors[color] = 0));

  const sizes = {} as Record<number, number>;
  for (let i = 1; i <= MAX_ITEMS_BOX; i++) {
    sizes[i] = 0;
  }

  let packages = 0;
  let items = 0;

  addressesWithPackages.forEach((address) => {
    address.kastes.forEach((pack) => {
      COLORS.forEach((color) => (totalColors[color] += pack[color]));
      items += pack.total;
      sizes[pack.total]++;
    });
    packages += address.kastes.length;
  });

  return {
    ...totalColors,
    addresses: addressesWithPackages.length,
    packages,
    items,
    packagesBySize: Object.keys(sizes)
      .sort()
      .map((size) => [+size, sizes[size]]),
  };
}

export function totalsByColor(packages: Array<Record<Colors, number>>): Record<Colors, number> {
  const totalColors = {} as Record<Colors, number>;
  COLORS.forEach((color) => (totalColors[color] = 0));

  packages.forEach((pack) => {
    COLORS.forEach((color) => (totalColors[color] += pack[color]));
  });

  return totalColors;
}

export function totalsBySize(packages: Array<{ total: number }>): Array<[number, number]> {
  const sizes = {} as Record<number, number>;
  for (let i = 1; i <= MAX_ITEMS_BOX; i++) {
    sizes[i] = 0;
  }

  packages.forEach((pack) => {
    sizes[pack.total]++;
  });

  return Object.keys(sizes)
    .sort()
    .map((size) => [+size, sizes[size]]);
}

function assertedType(data: number | string, field: string | number): typeof field {
  switch (typeof field) {
    case 'number':
      return isNaN(+data) ? 0 : +data;
    default:
      return data.toString().trim();
  }
}

function assertNotEmptyRecord(selectedFieldsObject: SelectedFields): boolean {
  return selectedFieldsObject.kods !== 0 && Boolean(selectedFieldsObject.adrese) && COLORS.some((color) => selectedFieldsObject[color] > 0);
}

function normalizeCount(count: number): number {
  return count < SINGLE_ITEM_CONTENTS ? count : Math.ceil(count / 500);
}

function rowToFieldsObject(row: Array<string | number>, columnMap: [number, ColumnNames][]): SelectedFields {
  const selectedFieldsObject = new SelectedFields();
  columnMap.forEach(([columnIndex, columnName]) => {
    (selectedFieldsObject as Record<ColumnNames, string | number>)[columnName] = assertedType(row[columnIndex], selectedFieldsObject[columnName]);
  });
  COLORS.forEach((color) => (selectedFieldsObject[color] = normalizeCount(selectedFieldsObject[color])));
  return selectedFieldsObject;
}

function packagesFromAdddress(fields: SelectedFields): AddressWithPackages {
  const packages: AddressPackage[] = [];

  const remainingItems = { ...fields };

  let currentPackage = addressPackage();

  COLORS.forEach((color) => {
    while (remainingItems[color] > 0) {
      const toPackage = Math.min(remainingItems[color], MAX_ITEMS_BOX - currentPackage.total);

      currentPackage[color] += toPackage;
      remainingItems[color] -= toPackage;

      currentPackage.total += toPackage;

      if (currentPackage.total === MAX_ITEMS_BOX) {
        packages.push(currentPackage);
        currentPackage = addressPackage();
      }
    }
  });
  if (currentPackage.total > 0) {
    packages.push(currentPackage);
  }

  return {
    kods: fields.kods,
    adrese: fields.adrese,
    kastes: packages,
  };
}
