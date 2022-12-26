/**
 * @file
 * Query registration and login data
 */
import { sleep } from '@portkey/utils';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import LockPage from 'pages/components/LockPage';
import RegisterHeader from 'pages/components/RegisterHeader';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useEffectOnce } from 'react-use';
import { useLoading } from 'store/Provider/hooks';

export default function BlankPage() {
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const fetchCreateWalletResult = useCallback(async () => {
    // TODO fetch create Wallet result
    await sleep(3000);
  }, []);

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
    navigate('/register/success');
  }, [fetchCreateWalletResult, navigate, setLoading]);

  return (
    <div className="blank-page-wrapper">
      <LockPage header={<RegisterHeader />} onUnLockHandler={onUnLockHandler} />
    </div>
  );
}
