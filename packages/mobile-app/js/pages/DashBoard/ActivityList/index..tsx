import React from 'react';
import TransferList from 'components/TransferList';
import NoData from 'components/NoData';
import { StyleSheet, FlatListProps } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useCurrentNetwork } from '@portkey/hooks/network';
import navigationService from 'utils/navigationService';
import { useLanguage } from 'i18n/hooks';

export enum NoDataMessage {
  CustomNetWorkNoData = 'No transaction records accessible from the current custom network',
  CommonNoData = 'You have no transactions',
}
type ActivityListPropsType = {
  rate: { USDT: string | number };
} & Omit<FlatListProps<any>, 'renderItem'>;

export default function ActivityList(props: ActivityListPropsType) {
  const { data, refreshing } = props;
  const { t } = useLanguage();
  const currentNetwork = useCurrentNetwork();
  const { isCustom } = currentNetwork;

  if (data?.length === 0 && !refreshing)
    return (
      <NoData type="top" message={isCustom ? t(NoDataMessage.CustomNetWorkNoData) : t(NoDataMessage.CommonNoData)} />
    );

  return (
    <TransferList
      style={styles.wrap}
      onPress={item => {
        navigationService.navigate('TransferDetail', { transferInfo: item });
      }}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
  },
});
