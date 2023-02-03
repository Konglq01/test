import { isIOS } from '@rneui/base';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import gSTyles from './GStyles';

export const useGStyles = makeStyles(theme => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.colors.bg1,
      ...gSTyles.paddingArg(0, pTd(16)),
    },
    pwTip: {
      marginTop: 3,
      color: theme.colors.font2,
    },
    safeAreaContainer: {
      paddingBottom: !isIOS ? 20 : undefined,
    },
  };
});
