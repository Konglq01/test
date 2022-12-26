import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import { TextL } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';

export type NoDataPropsType = {
  noPic?: boolean;
  message?: string;
  type?: 'center' | 'top';
  topDistance?: number | string;
};

const NoData: React.FC<NoDataPropsType> = props => {
  const { message = 'You have no transactions!', type, topDistance = pTd(89), noPic = false } = props;

  let topStyle: ViewStyle = {};

  if (type === 'top') {
    topStyle = {
      justifyContent: 'flex-start',
      paddingTop: topDistance,
    };
  }

  return (
    <View style={[styles.wrap, topStyle]}>
      {!noPic && <Svg icon="noData" oblongSize={[pTd(160), pTd(140)]} iconStyle={styles.img} />}
      <TextL style={styles.message}>{message}</TextL>
    </View>
  );
};
export default memo(NoData);
const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultColors.bg1,
  },
  img: {
    marginBottom: pTd(8),
  },
  message: {
    color: defaultColors.font7,
    lineHeight: pTd(22),
    textAlign: 'center',
  },
});
