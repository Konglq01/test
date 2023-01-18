import React, { useCallback, useRef } from 'react';
import PageContainer from 'components/PageContainer';
import { DigitInputInterface } from 'components/DigitInput';
import navigationService from 'utils/navigationService';
import useRouterParams from '@portkey/hooks/useRouterParams';
import ActionSheet from 'components/ActionSheet';
import useEffectOnce from 'hooks/useEffectOnce';
import { CAInfoType, ManagerInfo } from '@portkey/types/types-ca/wallet';
import { VerificationType } from '@portkey/types/verifier';
import myEvents from 'utils/deviceEvent';
import { AElfWallet } from '@portkey/types/aelf';
import PinContainer from 'components/PinContainer';
const scrollViewProps = {};
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
    const listener = myEvents.clearSetPin.addListener(() => digitInput.current?.reset());
    return () => listener.remove();
  });
  const leftCallback = useCallback(() => {
    if (!oldPin && managerInfo && managerInfo.verificationType !== VerificationType.communityRecovery)
      return ActionSheet.alert({
        title: 'Leave this page?',
        message: MessageMap[managerInfo.verificationType],
        buttons: [
          { title: 'No', type: 'outline' },
          // TODO: navigate
          {
            title: 'Yes',
            onPress: () => {
              if (managerInfo.verificationType === VerificationType.addManager) myEvents.clearQRWallet.emit();
              navigationService.navigate(RouterMap[managerInfo.verificationType]);
            },
          },
        ],
      });

    if (managerInfo && MessageMap[managerInfo.verificationType])
      return navigationService.navigate(RouterMap[managerInfo.verificationType]);

    navigationService.goBack();
  }, [managerInfo, oldPin]);
  return (
    <PageContainer
      scrollViewProps={scrollViewProps}
      titleDom
      type="leftBack"
      backTitle={oldPin ? 'Change Pin' : undefined}
      leftCallback={leftCallback}>
      <PinContainer
        ref={digitInput}
        title={oldPin ? 'Please enter a new pin' : 'Enter pin to protect your device'}
        onFinish={pin => {
          navigationService.navigate('ConfirmPin', { oldPin, pin, managerInfo, guardianCount, walletInfo, caInfo });
        }}
      />
    </PageContainer>
  );
}
