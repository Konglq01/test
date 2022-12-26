import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

export const styles = StyleSheet.create({
  sectionListWrap: {
    flex: 1,
    paddingRight: pTd(20),
  },
  sectionListWrapFull: {
    paddingRight: 0,
  },
  sectionIndex: {
    height: pTd(28),
    paddingLeft: pTd(20),
    lineHeight: pTd(28),
    fontSize: pTd(20),
  },
  indexBarWrap: {
    position: 'absolute',
    right: pTd(4),
    top: pTd(42),
    height: pTd(432),
    width: pTd(10),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'column',
  },
  indexItemWrap: {
    flex: 1,
  },
  indexItem: {
    width: pTd(10),
    textAlign: 'center',
    overflow: 'hidden',
    fontSize: pTd(11),
    lineHeight: pTd(11),
  },
});
