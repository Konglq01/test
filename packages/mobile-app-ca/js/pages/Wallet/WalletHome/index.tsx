import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { pageStyles } from './style';
import { pTd } from 'utils/unit';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import { BorderStyles, FontStyles } from 'assets/theme/styles';
import { useWallet } from 'hooks/store';
import Svg, { IconName } from 'components/Svg';

import MenuItem from 'components/MenuItem';
import ExistOverlay from './components/ExistOverlay';

interface WalletHomeProps {
  name?: string;
}

const WalletHome: React.FC<WalletHomeProps> = () => {
  const { t } = useLanguage();
  const { walletAvatar, walletName } = useWallet();

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
            <MenuItem onPress={() => navigationService.navigate('WalletName')} title={walletName} />
            <MenuItem onPress={() => navigationService.navigate('AutoLock')} title={t('Auto-Lock')} />
            <MenuItem onPress={() => navigationService.navigate('SwitchNetworks')} title={t('Switch Networks')} />
            <MenuItem onPress={() => navigationService.navigate('AboutUs')} title={t('About Us')} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      <CommonButton
        containerStyle={[GStyles.paddingTop(pTd(16)), GStyles.marginArg(0, 4)]}
        buttonStyle={[BorderStyles.border7]}
        titleStyle={FontStyles.font12}
        onPress={() => {
          ExistOverlay.showExistOverlay({
            callBack: isConfirm => {
              if (isConfirm) {
                // TODO: add Exit logic
              }
            },
          });
        }}>
        {t('Exit Wallet')}
      </CommonButton>
    </PageContainer>
  );
};
export default WalletHome;
