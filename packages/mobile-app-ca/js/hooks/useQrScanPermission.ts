import { useCallback, useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';

const useQrScanPermission = (): [boolean, () => Promise<boolean>] => {
  const [hasPermission, setHasPermission] = useState<any>(null);

  const requirePermission = useCallback(async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    const permissionResult: boolean = status === 'granted';
    setHasPermission(permissionResult);
    return permissionResult;
  }, []);

  return [hasPermission, requirePermission];
};

export default useQrScanPermission;
