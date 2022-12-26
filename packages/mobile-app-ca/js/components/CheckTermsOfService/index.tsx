import { defaultColors } from 'assets/theme';
import CheckIcon, { CheckIconProps } from 'components/CheckIcon';
import { PrimaryText, TextM } from 'components/CommonText';
import { useLanguage } from 'i18n/hooks';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';

export default function CheckTermsOfService(
  props: CheckIconProps & {
    title?: string;
  },
) {
  const { t } = useLanguage();
  return (
    <View style={styles.checkRow}>
      <CheckIcon checked={props.checked} onPress={props.onPress} />
      <TextM style={[styles.checkedTitle, styles.font14]}>
        {props.title ? (
          props.title
        ) : (
          <>
            {t('I agree to the')}
            <PrimaryText style={styles.font14} onPress={() => navigationService.navigate('TermsOfService')}>
              {t('Terms of Service')}
            </PrimaryText>
          </>
        )}
      </TextM>
    </View>
  );
}

const styles = StyleSheet.create({
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pTd(16),
  },
  font14: {
    fontSize: pTd(14),
  },
  checkedTitle: {
    marginLeft: pTd(12),
    color: defaultColors.font3,
  },
});
