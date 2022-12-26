import React from 'react';
import Svg from 'components/Svg';
import { TouchableOpacity, View } from 'react-native';
import { dashBoardBtnStyle, innerPageStyles } from '../SendButton/style';
import navigationService from 'utils/navigationService';
import { TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';

interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
}

export default function ReceiveButton(props: SendButtonType) {
  const { themeType = 'dashBoard' } = props;
  const { t } = useLanguage();
  const styles = themeType === 'dashBoard' ? dashBoardBtnStyle : innerPageStyles;

  return (
    <View style={styles.buttonWrap}>
      <TouchableOpacity
        onPress={() => {
          navigationService.navigate('Receive');
        }}>
        <Svg icon={themeType === 'dashBoard' ? 'receive' : 'receive1'} size={46} />
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
