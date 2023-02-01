/**
 * @file
 * Query registration and login data
 */
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { setCAInfo } from '@portkey/store/store-ca/wallet/actions';
import { PinErrorMessage } from '@portkey/utils/wallet/types';
import { message } from 'antd';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import LockPage from 'pages/components/LockPage';
import RegisterHeader from 'pages/components/RegisterHeader';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useEffectOnce } from 'react-use';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import { useFetchWalletCAAddress } from '@portkey/hooks/hooks-ca/wallet-result';

export default function QueryPage() {
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const fetchWalletResult = useFetchWalletCAAddress();
  const currentWalletInfo = useCurrentWalletInfo();

  const fetchCreateWalletResult = useCallback(
    async (pwd: string) => {
      try {
        if (!currentWalletInfo.managerInfo) throw 'Missing managerInfo';
        const walletResult = await fetchWalletResult({
          clientId: currentWalletInfo.address,
          requestId: currentWalletInfo.managerInfo.requestId || '',
          verificationType: currentWalletInfo.managerInfo.verificationType,
          managerUniqueId: currentWalletInfo.managerInfo.managerUniqueId,
        });
        console.log(walletResult, 'walletResult===');
        walletResult.Socket.stop();
        if (walletResult.status !== 'pass') {
          const errorString = walletResult?.message || walletResult.status;
          message.error((errorString as string) || 'Something error');
          await setLocalStorage({
            registerStatus: null,
          });
          setLoading(false);
          throw 'error';
        } else {
          if (!pwd) return message.error(PinErrorMessage.invalidPin);
          dispatch(
            setCAInfo({
              caInfo: {
                caAddress: walletResult.caAddress,
                caHash: walletResult.caHash,
              },
              pin: pwd,
              chainId: 'AELF',
            }),
          );
          setLoading(false);
          await setLocalStorage({
            registerStatus: 'Registered',
          });
          navigate('/register/success');
        }
      } catch (error) {
        console.log(error, 'fetch error===');
      }
    },
    [currentWalletInfo, dispatch, navigate, setLoading, fetchWalletResult],
  );

  useEffectOnce(() => {
    setLoading(0.5);
    InternalMessage.payload(InternalMessageTypes.GET_SEED)
      .send()
      .then((res) => {
        if (!res?.data?.privateKey) return setLoading(false);
        fetchCreateWalletResult(res.data.privateKey);
      });
  });

  const onUnLockHandler = useCallback(
    async (pwd: string) => {
      // get CA address
      setLoading(0.5);
      await fetchCreateWalletResult(pwd);
    },
    [fetchCreateWalletResult, setLoading],
  );

  return (
    <div className="query-page-wrapper">
      <LockPage header={<RegisterHeader />} onUnLockHandler={onUnLockHandler} />
    </div>
  );
}
