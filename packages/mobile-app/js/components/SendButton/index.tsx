import React, { memo, useMemo } from 'react';
import Svg from 'components/Svg';
import { dashBoardBtnStyle, innerPageStyles } from './style';
import { useAllAccountTokenList } from '@portkey-wallet/hooks/hooks-eoa/useToken';
import { useAppEOASelector } from '@portkey-wallet/hooks';

import navigationService from 'utils/navigationService';
import TokenOverlay from 'components/TokenOverlay/index';
import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';
import { isSameTypeToken } from '@portkey-wallet/utils/token';
import { View, TouchableOpacity } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';

import { pTd } from 'utils/unit';
interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  sentToken?: TokenItemShowType;
}

const SendButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard', sentToken } = props;
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;

  const { t } = useLanguage();
  const addedTokenData = useAllAccountTokenList();
  const { currentChain } = useAppEOASelector(state => state.chain);
  const { currentAccount } = useAppEOASelector(state => state.wallet);

  const currentTokenList = useMemo(() => {
    if (!currentAccount) return [];
    return addedTokenData?.[currentChain?.rpcUrl]?.[currentAccount?.address] ?? [];
  }, [addedTokenData, currentAccount, currentChain?.rpcUrl]);

  const onFinishSelectToken = (tokenItem: TokenItemShowType) => {
    if (!!tokenItem && currentTokenList.find(ele => isSameTypeToken(ele, tokenItem))) {
      navigationService.navigate('SendHome', { tokenItem });
    } else {
      throw new Error('this toke is not added');
    }
  };

  return (
    <View style={styles.buttonWrap}>
      <TouchableOpacity
        onPress={() => {
          if (themeType === 'innerPage') return navigationService.navigate('SendHome', { tokenItem: sentToken });

          if (currentTokenList.length === 1)
            return navigationService.navigate('SendHome', { tokenItem: currentTokenList?.[0] });

          TokenOverlay.showTokenList({ onFinishSelectToken });
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'send' : 'send1'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Send')}</TextM>
    </View>
  );
};

export default memo(SendButton);
