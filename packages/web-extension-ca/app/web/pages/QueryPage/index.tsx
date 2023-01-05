/**
 * @file
 * Query registration and login data
 */
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { useCurrentWalletInfo, useFetchWalletCAAddress } from '@portkey/hooks/hooks-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import { message } from 'antd';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import LockPage from 'pages/components/LockPage';
import RegisterHeader from 'pages/components/RegisterHeader';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useEffectOnce } from 'react-use';
import { useLoading } from 'store/Provider/hooks';

export default function QueryPage() {
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const fetchWalletResult = useFetchWalletCAAddress();
  const currentNetwork = useCurrentNetworkInfo();
  const currentWalletInfo = useCurrentWalletInfo();

  const fetchCreateWalletResult = useCallback(async () => {
    if (!currentWalletInfo.managerInfo) throw 'Missing managerInfo';
    const walletResult = await fetchWalletResult({
      baseUrl: currentNetwork.apiUrl,
      type: currentWalletInfo.managerInfo.type,
      // TODO
      verificationType: VerificationType.communityRecovery,
      loginGuardianType: currentWalletInfo.managerInfo.loginGuardianType,
      managerUniqueId: currentWalletInfo.managerInfo.managerUniqueId,
    });
    if (walletResult.status !== 'pass') {
      const errorString = walletResult?.message || walletResult.status;
      message.error((errorString as string) || 'Something error');
      setLoading(false);
      throw 'error';
    } else {
      setLoading(false);
      navigate('/register/success');
    }
  }, [currentNetwork, currentWalletInfo, fetchWalletResult, navigate, setLoading]);

  useEffectOnce(() => {
    setLoading(1);
    InternalMessage.payload(InternalMessageTypes.GET_SEED)
      .send()
      .then((res) => {
        if (!res?.data?.privateKey) return setLoading(false);
        fetchCreateWalletResult();
      });
  });
  const onUnLockHandler = useCallback(async () => {
    // get CA address
    setLoading(1);
    await fetchCreateWalletResult();
  }, [fetchCreateWalletResult, setLoading]);

  return (
    <div className="query-page-wrapper">
      <LockPage header={<RegisterHeader />} onUnLockHandler={onUnLockHandler} />
    </div>
  );
}
