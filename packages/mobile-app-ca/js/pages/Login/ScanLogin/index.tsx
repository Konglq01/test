import React, { useCallback, useState } from 'react';
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
import useRouterParams from '@portkey/hooks/useRouterParams';
import { LoginQRData } from '@portkey/types/types-ca/qrcode';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import CommonToast from 'components/CommonToast';
import { useGetCurrentCAContract } from 'hooks/contract';
import { addManager } from 'utils/wallet';
const ScrollViewProps = { disabled: true };
export default function ScanLogin() {
  const { data } = useRouterParams<{ data?: LoginQRData }>();
  const { address: managerAddress, deviceType } = data || {};

  const { caHash, address } = useCurrentWalletInfo();
  const [loading, setLoading] = useState<boolean>();
  const getCurrentCAContract = useGetCurrentCAContract();
  const onLogin = useCallback(async () => {
    if (!caHash || loading) return;
    try {
      setLoading(true);
      const contract = await getCurrentCAContract();
      const req = await addManager({ contract, caHash, address, managerAddress, deviceType });
      if (req?.error) throw req?.error;
      navigationService.navigate('Tab');
    } catch (error) {
      CommonToast.failError(error);
    }
    setLoading(false);
  }, [caHash, loading, getCurrentCAContract, address, managerAddress, deviceType]);
  return (
    <PageContainer
      scrollViewProps={ScrollViewProps}
      titleDom
      leftDom
      containerStyles={styles.containerStyles}
      leftCallback={() => navigationService.navigate('Tab')}
      rightDom={
        <Touchable onPress={() => navigationService.navigate('Tab')}>
          <Svg size={pTd(14)} color={FontStyles.font3.color} icon="close" />
        </Touchable>
      }>
      <View style={GStyles.itemCenter}>
        <Svg size={pTd(100)} icon="logo-icon" color={defaultColors.primaryColor} />
        <TextXXXL style={[styles.title, GStyles.textAlignCenter]}>Confirm Your Log In To Portkey</TextXXXL>
      </View>
      <View style={styles.bottomBox}>
        <CommonButton type="primary" title="Log In" onPress={onLogin} loading={loading} />
        <CommonButton
          buttonStyle={styles.cancelButtonStyle}
          type="clear"
          title="Cancel"
          onPress={() => navigationService.navigate('Tab')}
        />
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
