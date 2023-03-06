import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback } from 'react';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import { changeNetworkType } from '@portkey-wallet/store/store-ca/wallet/actions';
import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';

const SwitchNetworks: React.FC = () => {
  const { t } = useLanguage();
  const { currentNetwork } = useAppSelector(state => state.wallet);
  const NetworkList = useNetworkList();
  const appDispatch = useAppDispatch();

  const onNetworkChange = useCallback(
    (networkItem: NetworkItem) => {
      appDispatch(changeNetworkType(networkItem.networkType));
    },
    [appDispatch],
  );

  return (
    <PageContainer
      titleDom={t('Switch Networks')}
      safeAreaColor={['blue', 'gray']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: false }}>
      {NetworkList.map(item => (
        <Touchable
          key={item.networkType}
          disabled={item.networkType === currentNetwork || !item.isActive}
          onPress={() => onNetworkChange(item)}>
          <View style={styles.networkItemWrap}>
            <TextM style={!item.isActive && FontStyles.font7}>{item.name}</TextM>
            {item.isActive && item.networkType !== currentNetwork && (
              <TextS style={FontStyles.font4}>{t('Switch')}</TextS>
            )}
            {item.isActive && item.networkType === currentNetwork && (
              <Svg icon="selected" size={pTd(20)} color={defaultColors.primaryColor} />
            )}
          </View>
        </Touchable>
      ))}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg6,
    ...GStyles.paddingArg(32, 20, 0),
  },
  networkItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: pTd(56),
    paddingHorizontal: pTd(16),
    marginBottom: pTd(24),
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(6),
  },
});

export default SwitchNetworks;
