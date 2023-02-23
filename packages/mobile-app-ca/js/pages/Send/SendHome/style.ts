import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { ScreenHeight } from '@rneui/base';

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg4,
    height: ScreenHeight - pTd(130),
    paddingLeft: 0,
    paddingRight: 0,
  },
  group: {
    backgroundColor: defaultColors.bg1,
    marginTop: pTd(24),
    marginLeft: pTd(20),
    marginRight: pTd(20),
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    borderRadius: pTd(6),
  },
  buttonWrapStyle: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-end',
    paddingTop: pTd(12),
    width: pTd(375),
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
  errorMessage: {
    lineHeight: pTd(16),
    color: defaultColors.error,
    marginTop: pTd(4),
    marginLeft: pTd(26),
    paddingLeft: pTd(8),
  },
  space: {
    height: pTd(24),
  },
});

export const thirdGroupStyle = StyleSheet.create({
  wrap: {
    height: pTd(56),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderTop: {
    borderTopColor: defaultColors.border6,
    borderTopWidth: pTd(0.5),
  },
  title: {
    flex: 1,
    color: defaultColors.font3,
  },
  tokenNum: {
    textAlign: 'right',
    color: defaultColors.font5,
  },
  usdtNum: {
    marginLeft: pTd(6),
    marginTop: pTd(4),
    color: defaultColors.font3,
    textAlign: 'right',
  },
  notELFWrap: {
    height: pTd(84),
    alignItems: 'flex-start',
    paddingTop: pTd(18),
    paddingBottom: pTd(18),
  },
  totalWithUSD: {
    marginTop: pTd(12),
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});
