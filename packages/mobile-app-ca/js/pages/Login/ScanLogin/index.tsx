import React from 'react';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import { TextXXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
const ScrollViewProps = { disabled: true };
export default function ScanLogin() {
  return (
    <PageContainer
      scrollViewProps={ScrollViewProps}
      titleDom
      leftDom
      containerStyles={styles.containerStyles}
      rightDom={
        <Touchable onPress={() => navigationService.goBack()}>
          <Svg size={pTd(14)} color={FontStyles.font3.color} icon="close" />
        </Touchable>
      }>
      <View style={GStyles.itemCenter}>
        <Svg size={pTd(100)} icon="logo-icon" color={defaultColors.primaryColor} />
        <TextXXXL style={styles.title}>Confirm Your Log In To Portkey</TextXXXL>
      </View>
      <View style={styles.bottomBox}>
        <CommonButton type="primary" title="Log In" />
        <CommonButton buttonStyle={styles.cancelButtonStyle} type="clear" title="Cancel" />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    justifyContent: 'space-between',
    paddingBottom: 32,
    paddingTop: 100,
    alignItems: 'center',
  },
  title: {
    marginTop: 41,
  },
  bottomBox: {
    width: '100%',
    marginHorizontal: 16,
  },
  cancelButtonStyle: {
    marginTop: 8,
    backgroundColor: 'transparent',
  },
});
