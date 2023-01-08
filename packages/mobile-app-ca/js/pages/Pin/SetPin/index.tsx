import React, { useRef } from 'react';
import { TextL } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import DigitInput, { DigitInputInterface } from 'components/DigitInput';
import navigationService from 'utils/navigationService';
import { StyleSheet, View } from 'react-native';
import { windowHeight } from '@portkey/utils/mobile/device';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import useRouterParams from '@portkey/hooks/useRouterParams';
import ActionSheet from 'components/ActionSheet';
import useEffectOnce from 'hooks/useEffectOnce';
import { CAInfoType, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import myEvents from 'utils/deviceEvent';
import { AElfWallet } from '@portkey/types/aelf';

const MessageMap: any = {
  [VerificationType.register]: 'Are you sure you want to leave this page? All changes will not be saved.',
  [VerificationType.communityRecovery]:
    'Are you sure you want to leave this page? You will need approval from guardians again',
  [VerificationType.addManager]: 'After returning, you need to scan the code again to authorize login',
};
const RouterMap: any = {
  [VerificationType.register]: 'SelectVerifier',
  [VerificationType.communityRecovery]: 'GuardianApproval',
  [VerificationType.addManager]: 'LoginPortkey',
};
export default function SetPin() {
  const { oldPin, managerInfo, guardianCount, caInfo, walletInfo } = useRouterParams<{
    oldPin?: string;
    managerInfo?: ManagerInfo;
    guardianCount?: number;
    caInfo?: CAInfoType;
    walletInfo?: AElfWallet;
  }>();
  const digitInput = useRef<DigitInputInterface>();
  useEffectOnce(() => {
    const listener = myEvents.clearSetPin.addListener(() => digitInput.current?.resetPin());
    return () => listener.remove();
  });
  return (
    <PageContainer
      titleDom
      type="leftBack"
      leftCallback={() => {
        if (!oldPin && managerInfo) {
          ActionSheet.alert({
            title: 'Leave this page?',
            message: MessageMap[managerInfo.verificationType],
            buttons: [
              { title: 'No', type: 'outline' },
              // TODO: navigate
              {
                title: 'Yes',
                onPress: () => {
                  if (managerInfo.verificationType === VerificationType.communityRecovery)
                    myEvents.setGuardianStatus.emit({ key: 'resetGuardianApproval' });
                  if (managerInfo.verificationType === VerificationType.addManager) myEvents.clearQRWallet.emit();
                  navigationService.navigate(RouterMap[managerInfo.verificationType]);
                },
              },
            ],
          });
        } else {
          navigationService.goBack();
        }
      }}>
      <View style={styles.container}>
        <TextL style={GStyles.textAlignCenter}>Enter pin to protect your device</TextL>
        <DigitInput
          ref={digitInput}
          type="pin"
          secureTextEntry
          style={styles.pinStyle}
          onFinish={pin => {
            navigationService.navigate('ConfirmPin', { oldPin, pin, managerInfo, guardianCount, walletInfo, caInfo });
          }}
        />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    width: pTd(230),
    alignSelf: 'center',
    marginTop: windowHeight * 0.3,
  },
  pinStyle: {
    marginTop: 24,
  },
});
