import React from 'react';
import PageContainer from 'components/PageContainer';
import ListItem, { ListItemProps } from 'components/ListItem';
import useBiometricsReady from 'hooks/useBiometrics';
import navigationService from 'utils/navigationService';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { useLanguage } from 'i18n/hooks';
import CommonToast from 'components/CommonToast';

const list: ListItemProps[] = [
  {
    title: 'Devices',
    onPress: () => navigationService.navigate('Devices'),
  },
  {
    title: 'Change Pin',
    // TODO: remove disable
    // onPress: () => navigationService.navigate('CheckPin'),
    onPress: () => {
      return CommonToast.text('Coming soon. Check back here for updates');
    },
  },
];

export default function AccountSettings() {
  const biometricsReady = useBiometricsReady();
  const { t } = useLanguage();
  return (
    <PageContainer
      containerStyles={styles.containerStyles}
      safeAreaColor={['blue', 'gray']}
      titleDom={t('Account Setting')}>
      {list.map(item => (
        <ListItem style={styles.listStyle} key={item.title} {...item} title={t(item.title)} />
      ))}
      {biometricsReady && (
        <ListItem
          style={styles.listStyle}
          title={t('Biometric Authentication')}
          // TODO: remove disable
          // onPress={() => navigationService.navigate('Biometric')}
          onPress={() => CommonToast.text('Coming soon. Check back here for updates')}
        />
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    paddingTop: 8,
    backgroundColor: defaultColors.bg4,
  },
  listStyle: {
    marginTop: 24,
    marginBottom: 0,
  },
});
