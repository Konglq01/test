import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import navigationService from 'utils/navigationService';
import { useLanguage } from 'i18n/hooks';
import GameItem from '../GameItem';
import { TextL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import NoData from 'components/NoData';
import { IGameListItemType } from '@portkey-wallet/types/types-ca/discover';

interface GameSectionPropsType {
  data: IGameListItemType[];
}

export default function GameSection(props: GameSectionPropsType) {
  const { t } = useLanguage();
  const { data } = props;

  const navigateToSearch = useCallback((item: { url: string; name: string }) => {
    return navigationService.navigate('ViewOnWebView', { url: item.url, title: item.name });
  }, []);

  if (data.length === 0) return <NoData noPic message={t('There is no search result.')} />;

  return (
    <ScrollView style={styles.sectionWrap}>
      <View style={[styles.headerWrap, GStyles.flexRow, GStyles.spaceBetween]}>
        <TextL style={styles.header}>{t('Games')}</TextL>
      </View>
      {data?.map((item, index) => (
        <GameItem key={index} item={item} onPress={() => navigateToSearch(item)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionWrap: {
    ...GStyles.paddingArg(24, 20),
  },
  headerWrap: {
    height: pTd(22),
  },
  header: {
    ...fonts.mediumFont,
    lineHeight: pTd(24),
  },
  cancelButton: {
    paddingLeft: pTd(12),
    lineHeight: pTd(36),
  },
});
