import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

const styles = StyleSheet.create({
  container: {
    padding: 0,
    ...GStyles.paddingArg(0),
    backgroundColor: defaultColors.bg1,
    height: '100%',
  },
  inputWrap: {
    width: '100%',
    backgroundColor: defaultColors.bg5,
    ...GStyles.paddingArg(0, 16, 16),
  },
});
export default styles;
