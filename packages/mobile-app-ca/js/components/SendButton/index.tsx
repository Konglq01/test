import React, { memo, useMemo } from 'react';
import Svg from 'components/Svg';
import { dashBoardBtnStyle, innerPageStyles } from './style';
import navigationService from 'utils/navigationService';
import { TokenItemShowType } from '@portkey/types/types-eoa/token';
import { isSameTypeToken } from '@portkey/utils/token';
import { View, TouchableOpacity } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';

import * as Sentry from '@sentry/react-native';

import { pTd } from 'utils/unit';
import AssetsOverlay from 'pages/DashBoard/AssetsOverlay';
interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  sentToken?: TokenItemShowType;
}

const SendButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard', sentToken } = props;
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;

  const { t } = useLanguage();
  // const addedTokenData = useAllAccountTokenList();
  // const { currentChain } = useAppCASelector(state => state.chain);
  // const { currentAccount } = useAppCASelector(state => state.wallet);

  // const currentTokenList = useMemo(() => {
  //   if (!currentAccount) return [];
  //   // return addedTokenData?.[currentChain?.rpcUrl]?.[currentAccount?.address] ?? [];
  // }, [currentAccount]);

  // const onFinishSelectToken = (tokenItem: TokenItemShowType) => {
  //   if (!!tokenItem && currentTokenList.find(ele => isSameTypeToken(ele, tokenItem))) {
  //     navigationService.navigate('SendHome', { tokenItem });
  //   } else {
  //     throw new Error('this toke is not added');
  //   }
  // };

  const onFinishSelectToken = (item: any) => {
    navigationService.navigate('SendHome', {
      type: item.type,
      tokenItem: {
        symbol: 'ELF',
        decimal: 8,
      },
    });
    console.log('navigate');
  };

  return (
    <View style={styles.buttonWrap}>
      <TouchableOpacity
        onPress={() => {
          // navigationService.navigate('SendHome', {
          //   tokenItem: {
          //     symbol: 'ELF',
          //     decimal: 8,s
          //   },
          // });
          throw new Error('My first Sentry error!');

          Sentry.nativeCrash();

          if (themeType === 'innerPage') return navigationService.navigate('SendHome', { tokenItem: sentToken });
          // if (currentTokenList.length === 1)
          // return navigationService.navigate('SendHome', { tokenItem: currentTokenList?.[0] });
          AssetsOverlay.showAssetList({ onFinishSelectToken });
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'send' : 'send1'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Send')}</TextM>
    </View>
  );
};

export default memo(SendButton);
