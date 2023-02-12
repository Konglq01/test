import { Button, message } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import CommonModal from 'components/CommonModal';
import './index.less';
import { useCurrentWallet, useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
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
      const res = await getPrivateKeyAndMnemonic(
        {
          AESEncryptPrivateKey: walletInfo.AESEncryptPrivateKey,
        },
        passwordSeed,
      );
      if (!currentChain?.endPoint || !res?.privateKey) return message.error('error');
      setLoading(true);
      const result = await removeManager({
        rpcUrl: currentChain.endPoint,
        chainType: currentNetwork.walletType,
        address: currentChain.caContractAddress,
        privateKey: res.privateKey,
        paramsOption: {
          caHash: wallet?.caHash as string,
          manager: {
            managerAddress: wallet.address,
            deviceString: `${DEVICE_TYPE},${Date.now()}`,
          },
        },
      });
      const { TransactionId } = result.result.message || result;
      await sleep(1000);
      const aelfInstance = getAelfInstance(currentChain.endPoint);
      await getTxResult(aelfInstance, TransactionId);
      logout();
      clearLocalStorage();
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      message.error(contractErrorHandler(error));
      console.log('---exist wallet error', error);
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
      title={t('Are you sure you want to exit your wallet?')}
      footer={
        <div className="">
          <Button type="primary" onClick={onConfirm}>
            {t('I Understand，Confirm Exit')}
          </Button>
          <Button type="default" className="exist-wallet-btn-cancel" onClick={onCancel}>
            {t('Cancel')}
          </Button>
        </div>
      }>
      <div className="text-center modal-content">
        <div className="tip-title">
          {t('Your current wallet and assets will be removed from this app permanently. This action cannot be undone.')}
        </div>
        <div>{t('You can ONLY recover this wallet with your guardians.')}</div>
      </div>
    </CommonModal>
  );
}
