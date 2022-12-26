import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';

const { bg1, bg5 } = defaultColors;

export const headerHeight = pTd(52);

export const blueStyles = StyleSheet.create({
  sectionContainer: {
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    height: pTd(52),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: bg5,
  },
  leftDomWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: pTd(80),
  },
  centerWrap: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: bg1,
    fontWeight: 'bold',
  },
  rightDomWrap: {
    width: pTd(80),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  leftBackTitle: {
    color: bg1,
    marginLeft: pTd(4),
  },
});

export const whitStyles = StyleSheet.create({
  sectionContainer: {
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    height: pTd(52),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: bg1,
  },
  leftDomWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: pTd(80),
  },
  centerWrap: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: bg5,
    fontWeight: 'bold',
  },
  rightDomWrap: {
    width: pTd(80),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  leftBackTitle: {
    color: bg5,
  },
});

export default blueStyles;
