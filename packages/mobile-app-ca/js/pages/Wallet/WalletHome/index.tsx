import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useEffect } from 'react';
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
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import CommonToast from 'components/CommonToast';
import useLogOut from 'hooks/useLogOut';
import { removeManager } from 'utils/guardian';
import { useGetCurrentCAContract } from 'hooks/contract';
import { useAppDispatch } from 'store/hooks';
import { getWalletNameAsync } from '@portkey-wallet/store/store-ca/wallet/actions';

interface WalletHomeProps {
  name?: string;
}

const WalletHome: React.FC<WalletHomeProps> = () => {
  const { t } = useLanguage();
  const appDispatch = useAppDispatch();
  const { walletAvatar, walletName } = useWallet();
  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const getCurrentCAContract = useGetCurrentCAContract();
  const logout = useLogOut();

  useEffect(() => {
    appDispatch(getWalletNameAsync());
  }, [appDispatch]);

  const onExitClick = useCallback(
    async (isConfirm: boolean) => {
      if (!isConfirm || !managerAddress || !caHash) return;
      Loading.show();
      try {
        const caContract = await getCurrentCAContract();
        const req = await removeManager(caContract, managerAddress, caHash);
        if (req && !req.error) {
          console.log('logout success', req);
          logout();
        } else {
          CommonToast.fail(req?.error?.message || '');
        }
      } catch (error) {
        console.log(error, '=====error');

        CommonToast.failError(error);
      }
      Loading.hide();
    },
    [caHash, getCurrentCAContract, logout, managerAddress],
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
        type="outline"
        containerStyle={[GStyles.paddingTop(pTd(16)), GStyles.marginArg(0, 4), BorderStyles.border7]}
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
