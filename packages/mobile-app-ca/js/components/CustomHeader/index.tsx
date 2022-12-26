import { View, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import React, { ReactNode, useMemo } from 'react';
import Svg from 'components/Svg';
import { blueStyles, hideTitleStyles, whitStyles } from './style/index.style';
import { useNavigation } from '@react-navigation/native';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import type { SafeAreaColorMapKeyUnit } from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import { ViewStyleType } from 'types/styles';

export type CustomHeaderProps = {
  themeType?: SafeAreaColorMapKeyUnit;
  leftDom?: ReactNode;
  titleDom?: ReactNode | string;
  rightDom?: ReactNode;
  backTitle?: string;
  leftCallback?: () => void;
  type?: 'leftBack' | 'default';
  leftIconType?: 'close' | 'back';
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
    leftIconType = 'back',
  } = props;

  // theme change
  const styles = themeType === 'blue' ? blueStyles : whitStyles;

  const navigation = useNavigation();

  // if can go back
  const isCanGoBack = useMemo(() => navigation.canGoBack(), [navigation]);

  const leftIcon = useMemo(() => {
    const isClose = leftIconType === 'close';
    return (
      <Svg
        color={styles.leftBackTitle.color}
        icon={isClose ? 'close2' : 'left-arrow'}
        size={pTd(20)}
        iconStyle={GStyles.marginRight(pTd(4))}
      />
    );
  }, [leftIconType, styles.leftBackTitle.color]);

  const letElement = useMemo(() => {
    if (leftDom) return leftDom;
    if (!isCanGoBack) return null;
    const onPress = leftCallback ? leftCallback : () => navigationService.goBack();
    if (type === 'leftBack') {
      return (
        <TouchableOpacity style={[GStyles.flexRow, GStyles.itemCenter]} onPress={onPress}>
          {leftIcon}
          <TextL style={styles.leftBackTitle}>{backTitle || t('Back')}</TextL>
        </TouchableOpacity>
      );
    }
    return <TouchableOpacity onPress={onPress}>{leftIcon}</TouchableOpacity>;
  }, [backTitle, isCanGoBack, leftCallback, leftDom, leftIcon, styles.leftBackTitle, t, type]);

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

  // styles
  const headerStyles = useMemo(() => {
    const hideTitle = typeof titleDom === 'boolean';
    const leftDomWrap: ViewStyleType[] = [styles.leftDomWrap],
      centerWrap: ViewStyleType[] = [styles.centerWrap],
      rightDomWrap: ViewStyleType[] = [styles.rightDomWrap];
    if (hideTitle) {
      leftDomWrap.push(hideTitleStyles.leftDomWrap);
      centerWrap.push(hideTitleStyles.centerWrap);
      rightDomWrap.push(hideTitleStyles.rightDomWrap);
    }
    return { leftDomWrap, centerWrap, rightDomWrap };
  }, [styles.centerWrap, styles.leftDomWrap, styles.rightDomWrap, titleDom]);

  return (
    <View style={[styles.sectionContainer, style]}>
      <View style={headerStyles.leftDomWrap}>{letElement}</View>
      <View style={headerStyles.centerWrap}>{centerElement}</View>
      <View style={headerStyles.rightDomWrap}>{rightElement}</View>
    </View>
  );
};

export default CustomHeader;
