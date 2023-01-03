import * as React from 'react';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';
import { TextM } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import MenuItem from 'components/MenuItem';
import { settingMenuList } from 'navigation/setting';
import { RootStackName } from 'navigation';
import { IconName } from 'components/Svg';

const MenuList: Array<{
  name: RootStackName;
  label: string;
  icon: IconName;
}> = [
  {
    name: 'WalletHome',
    label: 'Wallet',
    icon: 'wallet',
  },
  {
    name: 'ContactsHome',
    label: 'Contacts',
    icon: 'contact2',
  },
  {
    name: 'SetPin',
    label: 'Account Setting',
    icon: 'setting2',
  },
  {
    name: 'GuardianHome',
    label: 'Guardians',
    icon: 'guardian',
  },
];

export default function MyMenu() {
  const { t } = useLanguage();
  const styles = useStyles();
  return (
    <PageContainer
      leftDom={<TextM />}
      titleDom={t('My')}
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.wrap}>
      {MenuList.map(ele => {
        return (
          <MenuItem
            icon={ele?.icon || 'setting'}
            title={t(ele.label)}
            key={ele.name}
            onPress={() => navigationService.navigate(ele.name)}
          />
        );
      })}
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
