import React, { useState } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';

const DeviceUnlock: React.FC = () => {
  const [devicePin, setDevicePin] = useState('');

  return (
    <PageContainer
      titleDom={''}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <TextM>Enter Pin</TextM>
      <TextM>
        To protect the privacy and security of your assets You need to enter the pin to decrypt and view the device
        details
      </TextM>
      <CommonInput
        type="general"
        theme="white-bg"
        label="Enter Pin"
        value={devicePin}
        placeholder="Enter Pin"
        maxLength={16}
        onChangeText={setDevicePin}
        keyboardType="number-pad"
      />
      <CommonButton
        type="primary"
        onPress={() => {
          navigationService.navigate('DeviceList', { devicePin });
        }}>
        Confirm
      </CommonButton>
      <CommonButton
        type="primary"
        onPress={() => {
          //
        }}>
        forget pin?
      </CommonButton>
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    ...GStyles.paddingArg(0, 20, 18),
  },
});

export default DeviceUnlock;
