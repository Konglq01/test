import { useCallback, useMemo } from 'react';
import { AutoLockData, AutoLockDataKey, DefaultLock } from 'constants/lock';
import { useStorage } from 'hooks/useStorage';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import storage from 'utils/storage/storage';
import CustomSelect from 'pages/components/CustomSelect';
import { useTranslation } from 'react-i18next';

export default function AutoLock({ className }: { className?: string }) {
  const { t } = useTranslation();
  const lockValue: AutoLockDataKey = useStorage('lockTime');

  const AutoLockList = useMemo(
    () =>
      Object.entries(AutoLockData).map(([key, label]) => ({
        value: key,
        children: t(label),
      })),
    [t],
  );

  const onLockChange = useCallback((value: string) => {
    value in AutoLockData &&
      setLocalStorage({
        [storage.lockTime]: value,
      });
  }, []);

  return (
    <CustomSelect
      className={className}
      items={AutoLockList}
      defaultValue={DefaultLock}
      value={lockValue}
      onChange={onLockChange}
      style={{ width: '100%' }}
    />
  );
}
