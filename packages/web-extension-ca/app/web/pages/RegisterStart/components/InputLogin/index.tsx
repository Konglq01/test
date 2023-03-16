import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { handleErrorCode, handleErrorMessage } from '@portkey-wallet/utils';
import { EmailError } from '@portkey-wallet/utils/check';
import CustomSvg from 'components/CustomSvg';
import i18n from 'i18n';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RegisterType } from 'types/wallet';
import { getHolderInfo } from 'utils/sandboxUtil/getHolderInfo';
import InputInfo, { InputInfoProps } from '../InputInfo';
import './index.less';

export default function InputLogin({
  type,
  onBack,
  onFinish,
}: {
  type: RegisterType;
  onBack?: () => void;
  onFinish: InputInfoProps['onFinish'];
}) {
  const { t } = useTranslation();

  const currentNetwork = useCurrentNetworkInfo();
  const currentChain = useCurrentChain();

  const validateEmail = useCallback(
    async (email?: string) => {
      //
      if (!currentChain) throw 'Could not find chain information';
      let isHasAccount = false;
      try {
        const checkResult = await getHolderInfo({
          rpcUrl: currentChain.endPoint,
          address: currentChain.caContractAddress,
          chainType: currentNetwork.walletType,
          paramsOption: {
            guardianIdentifier: email as string,
          },
        });
        if (checkResult.guardianList?.guardians?.length > 0) {
          isHasAccount = true;
        }
      } catch (error: any) {
        const code = handleErrorCode(error);
        if (code?.toString === '3002') {
          isHasAccount = false;
        } else {
          throw handleErrorMessage(error || 'GetHolderInfo error');
        }
      }

      if (type === 'Sign up') {
        if (isHasAccount) throw i18n.t(EmailError.alreadyRegistered);
      } else {
        if (!isHasAccount) throw i18n.t(EmailError.noAccount);
      }
    },
    [currentChain, currentNetwork.walletType, type],
  );

  const title = useMemo(() => (type === 'Login' ? t('Login') : t('Sign up')), [t, type]);

  return (
    <div>
      <h1 className="title">
        <CustomSvg type="BackLeft" onClick={onBack} />
        <span>{title}</span>
      </h1>
      <InputInfo validateEmail={validateEmail} confirmText={title} onFinish={onFinish} />
    </div>
  );
}
