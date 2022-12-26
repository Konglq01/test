import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { View, ViewProps } from 'react-native';
import { StyleSheet, ViewStyle } from 'react-native';
import { screenWidth } from '@portkey/utils/mobile/device';
import { pTd } from 'utils/unit';

import Touchable from 'components/Touchable';
import { defaultColors } from 'assets/theme';

export interface ModalBodyProps extends ViewProps {
  title?: string;
  modalBodyType?: 'center' | 'bottom';
  style?: ViewStyle;
}

export const ModalBody: React.FC<ModalBodyProps> = props => {
  const { title, modalBodyType, children, style = {} } = props;

  console.log(title);

  if (modalBodyType === 'bottom') {
    return (
      <View style={[styles.commonBox, styles.bottomBox, style]}>
        <Touchable style={styles.headerRow} onPress={OverlayModal.hide}>
          <View style={styles.headerIcon} />
        </Touchable>
        {children}
      </View>
    );
  }

  return <View style={[styles.commonBox, styles.centerBox, style]}>{children}</View>;
};

export const styles = StyleSheet.create({
  commonBox: {
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  bottomBox: {
    width: screenWidth,
  },
  centerBox: {
    width: screenWidth * 0.85,
  },
  headerRow: {
    paddingTop: pTd(14),
    paddingBottom: pTd(7),
    alignItems: 'center',
    borderBottomWidth: pTd(1),
    borderBottomColor: defaultColors.border6,
  },
  headerIcon: {
    height: pTd(5),
    borderRadius: pTd(3),
    backgroundColor: defaultColors.bg7,
    width: pTd(48),
  },
});
