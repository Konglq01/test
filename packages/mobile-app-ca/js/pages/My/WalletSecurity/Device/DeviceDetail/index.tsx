import React, { useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import DeviceItem from '../components/DeviceItem';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { DeviceItemType } from '@portkey-wallet/types/types-ca/device';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import { ApprovalType } from '@portkey-wallet/types/verifier';

interface RouterParams {
  deviceItem?: DeviceItemType;
}

const DeviceDetail: React.FC = () => {
  const { deviceItem } = useRouterParams<RouterParams>();
  const walletInfo = useCurrentWalletInfo();
  const isCurrent = useMemo(
    () => deviceItem && walletInfo.address === deviceItem.managerAddress,
    [deviceItem, walletInfo.address],
  );

  return (
    <PageContainer
      titleDom={'Devices Details'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      {deviceItem && <DeviceItem deviceItem={deviceItem} isCurrent={isCurrent} />}
      {!isCurrent && (
        <CommonButton
          type="primary"
          onPress={() => {
            if (!deviceItem?.managerAddress) return;
            navigationService.navigate('GuardianApproval', {
              approvalType: ApprovalType.removeOtherManager,
              removeManagerAddress: deviceItem?.managerAddress,
            });
          }}>
          Delete Device
        </CommonButton>
      )}
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

export default DeviceDetail;
