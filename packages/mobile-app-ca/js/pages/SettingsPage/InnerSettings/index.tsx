import * as React from 'react';
import { Text } from '@rneui/base';

import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { LOCAL_LANGUAGE } from 'i18n/config';
import { useAppCommonDispatch, useAppCASelector } from '@portkey/hooks';
import { changeLockingTime } from '@portkey/store/settings/action';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import ListItem from 'components/ListItem';
import Svg from 'components/Svg';
import SelectOverlay from 'components/SelectOverlay';

const AutoLockList: { value: number; label: string }[] = [
  {
    value: 0,
    label: 'Immediately',
  },
  {
    value: 15,
    label: 'After 15 Seconds',
  },
  {
    value: 60,
    label: 'After 60 Seconds',
  },
  {
    value: 300,
    label: 'After 5 Minutes',
  },
  {
    value: 600,
    label: 'After 10 Minutes',
  },
  {
    value: Infinity,
    label: 'Never',
  },
];

const LanguageList = LOCAL_LANGUAGE.map(ele => ({ ...ele, value: ele.language, label: ele.title }));

export default function InnerSettings() {
  const dispatch = useAppCommonDispatch();
  const { autoLockingTime } = useAppCASelector(state => state.settings);
  console.log('autoLockingTimeAutoLockingTime', autoLockingTime);

  const { language, changeLanguage, t } = useLanguage();

  return (
    <PageContainer
      titleDom={t('General')}
      type="leftBack"
      safeAreaColor={['blue', 'gray']}
      containerStyles={styles.pageContainer}>
      {/* language */}
      <View style={styles.itemWrap}>
        <Text style={styles.itemTitle}>{t('Current Language')}</Text>
        <ListItem
          title={LanguageList.find(ele => ele.value === language)?.label || ''}
          rightElement={<Svg icon="down-arrow" size={pTd(16)} />}
          onPress={() =>
            SelectOverlay.showSelectModal({
              title: t('Current Language'),
              value: language,
              dataList: LanguageList,
              onChangeValue: item => changeLanguage(String(item.value)),
            })
          }
        />
      </View>
      {/* lock-time */}
      <View style={styles.itemWrap}>
        <Text style={styles.itemTitle}>{t('Auto-Lock')}</Text>
        <ListItem
          title={t(AutoLockList.find(ele => ele.value === autoLockingTime)?.label || '')}
          rightElement={<Svg icon="down-arrow" size={pTd(16)} />}
          onPress={() =>
            SelectOverlay.showSelectModal({
              title: t('Auto-Lock'),
              value: autoLockingTime,
              dataList: AutoLockList,
              onChangeValue: item => {
                dispatch(changeLockingTime({ time: Number(item.value) }));
              },
            })
          }
        />
      </View>
    </PageContainer>
  );
}

export const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: defaultColors.bg4,
  },
  itemWrap: {
    marginTop: pTd(24),
  },
  itemTitle: {
    color: defaultColors.font3,
    marginLeft: pTd(8),
    marginBottom: pTd(8),
  },
});
