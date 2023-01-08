import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback } from 'react';
import { pageStyles } from './style';
import { pTd } from 'utils/unit';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import { BorderStyles, FontStyles } from 'assets/theme/styles';
import { useCredentials, useWallet } from 'hooks/store';
import Svg, { IconName } from 'components/Svg';

import WalletMenuItem from './components/WalletMenuItem';
import ExistOverlay from './components/ExistOverlay';
import Loading from 'components/Loading';
import { getELFContract } from 'contexts/utils';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { getWallet } from 'utils/redux';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import CommonToast from 'components/CommonToast';
import useLogOut from 'hooks/useLogOut';

interface WalletHomeProps {
  name?: string;
}

const WalletHome: React.FC<WalletHomeProps> = () => {
  const { t } = useLanguage();
  const { walletAvatar, walletName } = useWallet();
  const chainInfo = useCurrentChain('AELF');
  const { pin } = useCredentials() || {};
  const { caHash, address } = useCurrentWalletInfo();
  const logout = useLogOut();

  const onExitClick = useCallback(
    async (isConfirm: boolean) => {
      if (!isConfirm || !chainInfo || !pin || !caHash) return;
      try {
        const wallet = getWallet(pin);
        if (!wallet) return;
        Loading.show();
        const contract = await getELFContract({
          contractAddress: chainInfo.caContractAddress,
          rpcUrl: chainInfo.endPoint,
          account: wallet,
        });
        const req = await contract?.callSendMethod('RemoveManager', wallet.address, {
          caHash,
          manager: {
            managerAddress: address,
            deviceString: new Date().getTime(),
          },
        });
        if (req && !req.error) {
          console.log('logout success', req);
          logout();
        } else {
          CommonToast.fail(req?.error.message);
        }
      } catch (error) {
        CommonToast.failError(error);
      }
      Loading.hide();
    },
    [address, caHash, chainInfo, logout, pin],
  );

  return (
    <PageContainer
      titleDom={t('Wallet')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={[pageStyles.pageWrap]}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.avatarWrap}>
        <Svg icon={(walletAvatar as IconName) || 'master1'} size={pTd(80)} />
      </View>
      <ScrollView alwaysBounceVertical={false}>
        <TouchableWithoutFeedback>
          <View>
            <WalletMenuItem onPress={() => navigationService.navigate('WalletName')} title={walletName} />
            <WalletMenuItem onPress={() => navigationService.navigate('AutoLock')} title={t('Auto-Lock')} />
            <WalletMenuItem onPress={() => navigationService.navigate('SwitchNetworks')} title={t('Switch Networks')} />
            <WalletMenuItem onPress={() => navigationService.navigate('AboutUs')} title={t('About Us')} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      <CommonButton
        containerStyle={[GStyles.paddingTop(pTd(16)), GStyles.marginArg(0, 4)]}
        buttonStyle={[BorderStyles.border7]}
        titleStyle={FontStyles.font12}
        onPress={() => {
          ExistOverlay.showExistOverlay({
            callBack: onExitClick,
          });
        }}>
        {t('Exit Wallet')}
      </CommonButton>
    </PageContainer>
  );
};
export default WalletHome;
