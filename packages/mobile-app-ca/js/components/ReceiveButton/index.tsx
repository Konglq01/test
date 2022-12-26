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

interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  receiveButton?: any;
}

export default function ReceiveButton(props: SendButtonType) {
  const { themeType = 'dashBoard' } = props;
  const { t } = useLanguage();
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;

  return (
    <View style={styles.buttonWrap}>
      <TouchableOpacity
        onPress={() => {
          if (themeType === 'innerPage') return navigationService.navigate('Receive');

          TokenOverlay.showTokenList({
            onFinishSelectToken: () => navigationService.navigate('Receive'),
          });
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'receive' : 'receive1'} size={pTd(46)} />
      </TouchableOpacity>
      <TextM style={styles.titleStyle}>{t('Receive')}</TextM>
    </View>

    // <CommonButton
    //   title="receive"
    //   iconPosition="left"
    //   radius={8}
    //   icon={<Svg icon="add1" size={20} iconStyle={styles.iconStyle} />}
    //   titleStyle={styles.titleStyle}
    //   buttonStyle={styles.buttonStyle}
    //   onPress={() => {
    //   }}
    // />
  );
}
