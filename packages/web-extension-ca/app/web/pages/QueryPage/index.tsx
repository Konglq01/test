/**
 * @file
 * Query registration and login data
 */
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentWalletInfo, useFetchWalletCAAddress } from '@portkey/hooks/hooks-ca/wallet';
import { setCAInfo } from '@portkey/store/store-ca/wallet/actions';
import { message } from 'antd';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import LockPage from 'pages/components/LockPage';
import RegisterHeader from 'pages/components/RegisterHeader';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { useEffectOnce } from 'react-use';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { setLocalStorage } from 'utils/storage/chromeStorage';

export default function QueryPage() {
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const fetchWalletResult = useFetchWalletCAAddress();
  const currentNetwork = useCurrentNetworkInfo();
  const currentWalletInfo = useCurrentWalletInfo();
  const [password, setPassword] = useState<string>();

  const fetchCreateWalletResult = useCallback(async () => {
    if (!currentWalletInfo.managerInfo) throw 'Missing managerInfo';
    const walletResult = await fetchWalletResult({
      baseUrl: currentNetwork.apiUrl,
      type: currentWalletInfo.managerInfo.type,
      verificationType: currentWalletInfo.managerInfo.verificationType,
      loginGuardianType: currentWalletInfo.managerInfo.loginGuardianType,
      managerUniqueId: currentWalletInfo.managerInfo.managerUniqueId,
    });
    if (walletResult.status !== 'pass') {
      const errorString = walletResult?.message || walletResult.status;
      message.error((errorString as string) || 'Something error');
      await setLocalStorage({
        registerStatus: null,
      });
      setLoading(false);
      throw 'error';
    } else {
      if (!password) return;
      dispatch(
        setCAInfo({
          caInfo: {
            caAddress: walletResult.caAddress,
            caHash: walletResult.caHash,
          },
          pin: password,
          chainId: 'AELF',
        }),
      );
      setLoading(false);
      await setLocalStorage({
        registerStatus: 'Registered',
      });
      navigate('/register/success');
    }
  }, [currentWalletInfo, currentNetwork, password, dispatch, navigate, setLoading, fetchWalletResult]);

  useEffectOnce(() => {
    setLoading(1);
    InternalMessage.payload(InternalMessageTypes.GET_SEED)
      .send()
      .then((res) => {
        if (!res?.data?.privateKey) return setLoading(false);
        setPassword(res.data.privateKey);
        fetchCreateWalletResult();
      });
  });

  const onUnLockHandler = useCallback(
    async (pwd: string) => {
      // get CA address
      setLoading(1);
      setPassword(pwd);
      await fetchCreateWalletResult();
    },
    [fetchCreateWalletResult, setLoading],
  );

  return (
    <div className="query-page-wrapper">
      <LockPage header={<RegisterHeader />} onUnLockHandler={onUnLockHandler} />
    </div>
  );
}
