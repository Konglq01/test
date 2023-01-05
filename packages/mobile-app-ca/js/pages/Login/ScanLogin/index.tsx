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
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { getELFContract } from 'contexts/utils';
import { getWallet } from 'utils/redux';
import { useCredentials } from 'hooks/store';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import CommonToast from 'components/CommonToast';
const ScrollViewProps = { disabled: true };
export default function ScanLogin() {
  const { data } = useRouterParams<{ data?: LoginQRData }>();
  const chainInfo = useCurrentChain('AELF');
  const { address } = data || {};

  const { pin } = useCredentials() || {};
  const { AELF } = useCurrentWalletInfo();
  console.log(address, AELF, '====address');
  const [loading, setLoading] = useState<boolean>();
  const onLogin = useCallback(async () => {
    if (!chainInfo || !pin || !AELF || loading) return;
    const wallet = getWallet(pin);
    if (!wallet) return;
    setLoading(true);
    const contract = await getELFContract({
      contractAddress: chainInfo.caContractAddress,
      rpcUrl: chainInfo.endPoint,
      account: wallet,
    });
    const req = await contract?.callSendMethod('AddManager', wallet.address, {
      caHash: AELF?.caHash,
      manager: {
        managerAddress: address,
        deviceString: new Date().getTime(),
      },
    });
    setLoading(false);
    if (!req?.error) {
      navigationService.navigate('Tab');
    } else {
      CommonToast.fail(req?.error.message);
    }
  }, [AELF, address, chainInfo, loading, pin]);
  return (
    <PageContainer
      scrollViewProps={ScrollViewProps}
      titleDom
      leftDom
      containerStyles={styles.containerStyles}
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
