import useVerifierList from 'hooks/useVerifierList';
import { useEffect } from 'react';
import { keepAliveOnPages } from 'utils/keepSWActive';
import useUpdateRedux from './useUpdateRedux';

export default function Updater() {
  useVerifierList();
  useUpdateRedux();
  useEffect(() => {
    keepAliveOnPages();
  }, []);

  // Query the caAddress of each chain

  return null;
}
