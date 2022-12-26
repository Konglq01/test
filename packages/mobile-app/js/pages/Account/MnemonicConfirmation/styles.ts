import { makeStyles } from '@rneui/themed';
import { defaultColors } from 'assets/theme';
import { windowHeight } from 'utils/device';
import { pTd } from 'utils/unit';

const useStyles = makeStyles(theme => {
  return {
    mnemonicBox: {
      marginTop: pTd(24),
      paddingHorizontal: pTd(8),
      backgroundColor: theme.colors.border2,
      paddingBottom: 10,
      borderRadius: pTd(4),
    },
    sortMnemonicBox: {
      backgroundColor: theme.colors.bg1,
      marginBottom: pTd(19),
      paddingHorizontal: 0,
    },
    mnemonicItem: {
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'flex-start',
      width: '30%',
      backgroundColor: theme.colors.bg1,
      marginTop: 10,
      marginHorizontal: '1.5%',
      paddingHorizontal: pTd(8),
      borderRadius: pTd(4),
      minHeight: 36,
      // lineHeight: 36,
    },
    mnemonicKey: {
      color: theme.colors.font7,
      width: pTd(25),
    },
    mnemonicText: {
      color: theme.colors.font5,
    },
    mnemonicItemDisabled: {
      opacity: 0.3,
    },
    sortMnemonicItem: {
      borderWidth: pTd(1),
      borderColor: theme.colors.border1,
    },
    titleStyle: {
      marginTop: pTd(8),
      paddingHorizontal: pTd(20),
      alignSelf: 'center',
      textAlign: 'center',
    },
    detailsStyle: {
      alignSelf: 'center',
      textAlign: 'center',
      paddingHorizontal: pTd(10),
      color: defaultColors.font3,
      marginTop: pTd(8),
      // marginBottom: pTd(24),
    },
    reloadRow: {
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      marginBottom: 13,
    },
    reloadText: {
      marginLeft: pTd(9),
    },
    viewContainer: {
      minHeight: windowHeight - pTd(140),
    },
    tipText: {
      marginLeft: pTd(8),
      color: defaultColors.error,
    },
  };
});

export default useStyles;
