import React, { memo, useMemo } from 'react';
import Svg from 'components/Svg';
import { dashBoardBtnStyle, innerPageStyles } from './style';
import navigationService from 'utils/navigationService';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';

import { View, TouchableOpacity } from 'react-native';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';

import { pTd } from 'utils/unit';
import AssetsOverlay from 'pages/DashBoard/AssetsOverlay';
import { useGetCurrentCAContract } from 'hooks/contract';
interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  sentToken?: TokenItemShowType;
}

const SendButton = (props: SendButtonType) => {
  const { themeType = 'dashBoard', sentToken } = props;
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;

  const { t } = useLanguage();

  const getCurrentCAContract = useGetCurrentCAContract();

  return (
    <View style={styles.buttonWrap}>
      <TouchableOpacity
        onPress={async () => {
          if (themeType === 'innerPage')
            return navigationService.navigate('SendHome', {
              sendType: 'token',
              assetInfo: sentToken,
              toInfo: {
                name: '',
                address: '',
              },
            } as unknown as IToSendHomeParamsType);
          // if (currentTokenList.length === 1)
          // return navigationService.navigate('SendHome', { tokenItem: currentTokenList?.[0] });
          AssetsOverlay.showAssetList({});
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'send' : 'send1'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Send')}</TextM>
    </View>
  );
};

export default memo(SendButton);
