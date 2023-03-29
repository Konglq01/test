import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { TextL, TextS } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { FlatList, StyleSheet, View, FlatListProps } from 'react-native';
import { pTd } from 'utils/unit';

export type CommonSectionPropsType = {
  headerTitle: string;
  sectionWrapStyles?: any;
  clearCallback?: () => void;
} & FlatListProps<any>;

export function CommonSection(props: CommonSectionPropsType) {
  const { headerTitle, clearCallback, sectionWrapStyles = {} } = props;

  const { t } = useLanguage();

  return (
    <View style={[styles.sectionWrap, sectionWrapStyles]}>
      <View style={[styles.headerWrap, GStyles.flexRow, GStyles.spaceBetween]}>
        <TextL style={styles.header}>{headerTitle}</TextL>
        <TextS style={[FontStyles.font4, GStyles.alignCenter]} onPress={clearCallback}>
          {!!clearCallback && t('Clear')}
        </TextS>
      </View>
      <FlatList scrollEnabled={false} {...props} />
    </View>
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
});
