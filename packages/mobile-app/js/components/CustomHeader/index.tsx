import { View, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import React, { ReactNode, useMemo } from 'react';
import Svg from 'components/Svg';
import { blueStyles, whitStyles } from './style/index.style';
import { useNavigation } from '@react-navigation/native';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import type { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';

export type CustomHeaderProps = {
  themeType?: SafeAreaColorMapKeyUnit;
  leftDom?: ReactNode;
  titleDom?: ReactNode | string;
  rightDom?: ReactNode;
  backTitle?: string;
  leftCallback?: () => void;
  type?: 'leftBack' | 'default';
  style?: StyleProp<ViewStyle>;
};

const CustomHeader: React.FC<CustomHeaderProps> = props => {
  const { t } = useLanguage();

  const {
    leftDom = null,
    titleDom = 'title',
    rightDom = null,
    backTitle,
    leftCallback,
    type = 'default',
    themeType = 'white',
    style,
  } = props;

  // theme change
  const styles = themeType === 'blue' ? blueStyles : whitStyles;

  const navigation = useNavigation();

  // if can go back
  const isCanGoBack = useMemo(() => navigation.canGoBack(), [navigation]);

  const letElement = useMemo(() => {
    if (leftDom) return leftDom;
    if (!isCanGoBack) return null;
    const onPress = leftCallback ? leftCallback : () => navigationService.goBack();
    if (type === 'leftBack') {
      return (
        <TouchableOpacity style={[GStyles.flexRowWrap, GStyles.itemCenter]} onPress={onPress}>
          <Svg color={styles.leftBackTitle.color} icon="left-arrow" size={pTd(20)} />
          <TextL style={styles.leftBackTitle}>{backTitle || t('Back')}</TextL>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={onPress}>
        <Svg color={styles.leftBackTitle.color} icon="left-arrow" size={pTd(20)} />
      </TouchableOpacity>
    );
  }, [backTitle, isCanGoBack, leftCallback, leftDom, styles.leftBackTitle, t, type]);

  const centerElement = useMemo(() => {
    if (typeof titleDom === 'string')
      return (
        <TextL numberOfLines={1} style={styles.title}>
          {titleDom}
        </TextL>
      );
    return titleDom;
  }, [styles.title, titleDom]);

  const rightElement = useMemo(() => rightDom, [rightDom]);
  return (
    <View style={[styles.sectionContainer, style]}>
      <View style={styles.leftDomWrap}>{letElement}</View>
      <View style={styles.centerWrap}>{centerElement}</View>
      <View style={styles.rightDomWrap}>{rightElement}</View>
    </View>
  );
};

export default CustomHeader;
