import { makeStyles } from '@rneui/themed';
import { defaultColors } from 'assets/theme';
import { windowHeight } from '@portkey/utils/mobile/device';
import { pTd } from 'utils/unit';

const useStyles = makeStyles(theme => {
  return {
    mnemonicBox: {
      marginBottom: pTd(24),
      paddingHorizontal: pTd(5),
      backgroundColor: theme.colors.border2,
      justifyContent: 'center',
      paddingBottom: pTd(10),
    },
    mnemonicItem: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '30%',
      backgroundColor: theme.colors.bg1,
      marginTop: pTd(10),
      marginHorizontal: '1.5%',
      padding: pTd(8),
      borderRadius: pTd(4),
      height: pTd(36),
    },
    mnemonicKey: {
      color: theme.colors.font7,
      width: pTd(25),
    },
    mnemonicText: {
      color: theme.colors.font5,
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
      marginBottom: pTd(24),
    },
    tipsBox: {
      borderRadius: pTd(4),
      padding: pTd(12),
      backgroundColor: defaultColors.bg3,
      marginBottom: pTd(24),
    },
    tipsText: {
      color: defaultColors.error,
    },
    viewContainer: {
      minHeight: windowHeight - pTd(280),
    },
  };
});

export default useStyles;
