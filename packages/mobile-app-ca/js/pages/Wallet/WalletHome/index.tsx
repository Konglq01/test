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
import { useWallet } from 'hooks/store';
import Svg, { IconName } from 'components/Svg';
import WalletMenuItem from './components/WalletMenuItem';
import ExistOverlay from './components/ExistOverlay';
import Loading from 'components/Loading';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import CommonToast from 'components/CommonToast';
import useLogOut from 'hooks/useLogOut';
import { removeManager } from 'utils/guardian';
import { useCurrentCAContract } from 'hooks/contract';

interface WalletHomeProps {
  name?: string;
}

const WalletHome: React.FC<WalletHomeProps> = () => {
  const { t } = useLanguage();
  const { walletAvatar, walletName } = useWallet();
  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const caContract = useCurrentCAContract();
  const logout = useLogOut();

  const onExitClick = useCallback(
    async (isConfirm: boolean) => {
      if (!isConfirm || !caContract || !managerAddress || !caHash) return;
      try {
        Loading.show();
        const req = await removeManager(caContract, managerAddress, caHash);
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
    [caContract, caHash, logout, managerAddress],
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
