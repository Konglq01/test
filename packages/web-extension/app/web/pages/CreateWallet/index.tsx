import { useCallback } from 'react';
import PortKeyTitle from '../components/PortKeyTitle';
import { useNavigate } from 'react-router';
import { message } from 'antd';
import { SuccessPageType } from 'types/UI';
import CreateWalletPage from '../components/CreateWalletPage';
import InternalMessage from 'messages/InternalMessage';
import InternalMessageTypes from 'messages/InternalMessageTypes';
import { createWallet } from '@portkey-wallet/store/wallet/actions';
import { useAppDispatch, useLoading } from 'store/Provider/hooks';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import { setPasswordSeed } from 'store/reducers/user/slice';
import './index.less';

export default function CreateWallet() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [, setLoading] = useLoading();

  const onCreate = useCallback(
    async (values: { password: string; walletName: string }) => {
      setLoading(true);
      try {
        const { password, walletName } = values;
        await dispatch(createWallet({ walletName, password }));
        setLocalStorage({
          registerStatus: 'registrationNotBackedUp',
        });
        InternalMessage.payload(InternalMessageTypes.SET_SEED, password).send();
        dispatch(setPasswordSeed(password));
        setLoading(false);
        navigate(`/success-page/${SuccessPageType.Creating}`);
      } catch (error) {
        message.error('something error');
      }
      setLoading(false);
    },
    [dispatch, navigate, setLoading],
  );

  return (
    <div className="common-page create-wallet-wrapper">
      <PortKeyTitle leftElement />
      <CreateWalletPage onCreate={onCreate} />
    </div>
  );
}
