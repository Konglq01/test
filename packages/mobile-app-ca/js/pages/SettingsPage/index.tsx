import * as React from 'react';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';
import useLocking from 'hooks/useLocking';
import CommonButton from 'components/CommonButton';
import { TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import MenuItem from 'components/MenuItem';
import { settingMenuList } from 'navigation/setting';

export default function SettingsPage() {
  const { t } = useLanguage();
  const styles = useStyles();
  const onLocking = useLocking();
  return (
    <PageContainer
      leftDom={<TextM />}
      titleDom={t('Settings')}
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.wrap}>
      {settingMenuList.map(ele => {
        return (
          <MenuItem
            icon={ele?.icon || 'setting'}
            title={t(ele.label)}
            key={ele.name}
            onPress={() => navigationService.navigate(ele.name)}
          />
        );
      })}

      <CommonButton type="solid" title="lock" onPress={onLocking} />
    </PageContainer>
  );
}

const useStyles = makeStyles(theme => {
  return {
    wrap: {
      flex: 1,
      backgroundColor: defaultColors.bg1,
      ...GStyles.paddingArg(8, 0, 0),
    },
    mnemonicItemDisabled: {
      backgroundColor: theme.colors.bg6,
      color: theme.colors.font3,
      borderColor: theme.colors.bg6,
    },
    sortMnemonicItem: {
      borderWidth: pTd(1),
      borderColor: theme.colors.border1,
    },
  };
});
