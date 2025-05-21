export type KeysMap = Record<string, string | NestedKeysMap>;
export type NestedKeysMap = {
  name: string;
  keysMap: KeysMap;
};

export function renameKeys<T extends Record<string, any>>(keysMap: KeysMap, obj: T) {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (Array.isArray(obj[key]) && typeof keysMap[key] === 'object') {
        const keyMap = keysMap[key];
        return {
          ...acc,
          ...{ [keyMap.name]: obj[key].map((item) => renameKeys(keyMap.keysMap, item)) },
        };
      } else if (typeof keysMap[key] === 'object') {
        const keyMap = keysMap[key];
        return {
          ...acc,
          ...{ [keyMap.name]: renameKeys(keyMap.keysMap, obj[key]) },
        };
      } else if (keysMap[key]) {
        return {
          ...acc,
          ...{ [keysMap[key] || key]: obj[key] },
        };
      }
      return {
        ...acc,
        ...{ [key]: obj[key] },
      };
    },
    {} as Record<string, any>,
  );
}
