import { useCallback, useEffect, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { apis } from 'utils/BrowserApis';
import _storage, { StorageKeyType } from 'utils/storage/storage';
import { getLocalStorage } from 'utils/storage/chromeStorage';

export const useStorage = (storageName: StorageKeyType) => {
  const [storage, setStorage] = useState<any>();

  const storageChange: (
    changes: {
      [key: string]: chrome.storage.StorageChange;
    },
    areaName: 'sync' | 'local' | 'managed' | 'session',
  ) => void = useCallback(
    (changes) => {
      if (_storage[storageName] in changes) {
        setStorage(changes[_storage[storageName]].newValue);
      }
    },
    [storageName],
  );

  useEffect(() => {
    apis.storage.onChanged.addListener(storageChange);
    return () => {
      apis.storage.onChanged.removeListener(storageChange);
    };
  }, [storageChange]);

  useEffectOnce(() => {
    getLocalStorage(storageName).then((v) => setStorage(v));
  });

  return storage;
};
