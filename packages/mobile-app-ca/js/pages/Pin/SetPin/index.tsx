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
import { usePreventHardwareBack } from '@portkey/hooks/mobile';
import { ManagerInfo } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import myEvents from 'utils/deviceEvent';

const MessageMap: any = {
  0: 'Are you sure you want to leave this page? All changes will not be saved.',
  1: 'Are you sure you want to leave this page? You will need approval from guardians again',
  2: 'After returning, you need to scan the code again to authorize login',
};
const RouterMap: any = {
  0: 'SelectVerifier',
  1: 'GuardianApproval',
  2: 'LoginPortkey',
};
export default function SetPin() {
  const { oldPin, managerInfo, guardianCount } = useRouterParams<{
    oldPin?: string;
    managerInfo?: ManagerInfo;
    guardianCount?: number;
  }>();
  usePreventHardwareBack();
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
            navigationService.navigate('ConfirmPin', { oldPin, pin, managerInfo, guardianCount });
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
