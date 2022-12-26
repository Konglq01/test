import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';

const { bg5, font3, bg1 } = defaultColors;

export const Styles = StyleSheet.create({
  itemWrap: {
    height: 64,
    width: '100%',
    backgroundColor: bg1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftDom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
  },
  buttonDefault: {
    width: 40,
    height: 20,
    lineHeight: 20,
    fontSize: 12,
    color: font3,
  },
  buttonStyle: {
    width: 40,
    height: 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: bg5,
    lineHeight: 20,
    fontSize: 12,
    textAlign: 'center',
    color: bg5,
  },
});
