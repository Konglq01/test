import React from 'react';
import Svg from 'components/Svg';
import { TouchableOpacity, View } from 'react-native';
import { dashBoardBtnStyle, innerPageStyles } from '../SendButton/style';
import navigationService from 'utils/navigationService';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import TokenOverlay from 'components/TokenOverlay';
import { TokenItemShowType } from '@portkey/types/types-ca/token';
import { pTd } from 'utils/unit';
import CommonToast from 'components/CommonToast';

interface SendButtonType {
  currentTokenInfo?: any;
  themeType?: 'dashBoard' | 'innerPage';
  receiveButton?: any;
}

export default function ReceiveButton(props: SendButtonType) {
  const { themeType = 'dashBoard', currentTokenInfo = {} } = props;
  const { t } = useLanguage();
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;

  return (
    <View style={styles.buttonWrap}>
      <TouchableOpacity
        onPress={() => {
          if (themeType === 'innerPage') return navigationService.navigate('Receive', currentTokenInfo);

          TokenOverlay.showTokenList({
            onFinishSelectToken: (token: TokenItemShowType) => {
              navigationService.navigate('Receive', token);
            },
          });
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'receive' : 'receive1'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Receive')}</TextM>
    </View>
  );
}
