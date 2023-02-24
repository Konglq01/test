import { Button, message } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CommonModal from 'components/CommonModal';
import './index.less';
import { useCurrentWallet, useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { useLoading, useUserInfo } from 'store/Provider/hooks';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { removeManager } from 'utils/sandboxUtil/removeManager';
import { getAelfInstance } from '@portkey/utils/aelf';
import { getTxResult } from 'utils/aelfUtils';
import { sleep } from '@portkey/utils';
import { useCurrentNetworkInfo } from '@portkey/hooks/hooks-ca/network';
import { clearLocalStorage } from 'utils/storage/chromeStorage';
import { contractErrorHandler } from 'utils/tryErrorHandler';
import useLogOut from 'hooks/useLogout';
import { DEVICE_TYPE } from 'constants/index';
import aes from '@portkey/utils/aes';

interface ExitWalletProps {
  open: boolean;
  onCancel: () => void;
}

export default function ExitWallet({ open, onCancel }: ExitWalletProps) {
  const { t } = useTranslation();
  const { walletInfo } = useCurrentWallet();
  const wallet = useCurrentWalletInfo();
  const { passwordSeed } = useUserInfo();
  const currentChain = useCurrentChain();
  const { setLoading } = useLoading();
  const currentNetwork = useCurrentNetworkInfo();
  const logout = useLogOut();

  const onConfirm = useCallback(async () => {
    try {
      if (!passwordSeed) throw 'Missing pin';
      const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
      if (!currentChain?.endPoint || !privateKey) return message.error('error');
      setLoading(true);
      const result = await removeManager({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey,
        paramsOption: {
          caHash: wallet?.caHash as string,
          manager: {
            managerAddress: wallet.address,
            deviceString: `${DEVICE_TYPE},${Date.now()}`,
          },
        },
      });
      console.log('removeManager', 'removeManager==result', result);
      // const { TransactionId } = result.result.message || result;
      // await sleep(1000);
      // const aelfInstance = getAelfInstance(currentChain.endPoint);
      // await getTxResult(aelfInstance, TransactionId);
      logout();
      clearLocalStorage();
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      const _error = contractErrorHandler(error) || 'Something error';
      message.error(_error);
    }
  }, [
    currentChain,
    currentNetwork.walletType,
    logout,
    passwordSeed,
    setLoading,
    wallet.address,
    wallet?.caHash,
    walletInfo.AESEncryptPrivateKey,
  ]);

  return (
    <CommonModal
      className="exist-wallet"
      closable={false}
      width={320}
      open={open}
      title={t('Are you sure you want to exit your account?')}
      footer={
        <div className="">
          <Button type="primary" onClick={onConfirm}>
            {t('Exit Anyway')}
          </Button>
          <Button type="default" className="exist-wallet-btn-cancel" onClick={onCancel}>
            {t('Cancel')}
          </Button>
        </div>
      }>
      <div className="text-center modal-content">
        {/* <div className="tip-title">{t('Are you sure you want to exit your account?')}</div> */}
        <div>
          {t('After you exit, your assets remain in your account and you can access them through social recovery.')}
        </div>
      </div>
    </CommonModal>
  );
}
