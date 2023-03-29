import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import CommonInput from 'components/CommonInput';
import GStyles from 'assets/theme/GStyles';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import PageContainer from 'components/PageContainer';
import navigationService from 'utils/navigationService';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { TextM } from 'components/CommonText';
import { useFocusEffect } from '@react-navigation/native';
import Svg from 'components/Svg';
import { CommonSection } from '../components/CommonSection';
import RecordItem from '../components/RecordItem';
import NoData from 'components/NoData';

export default function DiscoverSearch() {
  const { t } = useLanguage();
  const iptRef = useRef<any>();
  const [value, setValue] = useState<string>('');

  const navBack = useCallback(() => {
    navigationService.goBack();
  }, []);

  const clearText = useCallback(() => {
    setValue('');
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (iptRef?.current) iptRef.current.focus();
    }, []),
  );

  return (
    <PageContainer
      hideHeader
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.container}
      scrollViewProps={{ disabled: true }}>
      <View style={[BGStyles.bg5, GStyles.flexRow, styles.inputContainer]}>
        <CommonInput
          ref={iptRef}
          value={value}
          onChangeText={v => setValue(v)}
          returnKeyType="search"
          placeholder={t('Enter URL to explorer')}
          containerStyle={styles.inputStyle}
          rightIcon={
            value ? (
              <TouchableOpacity onPress={clearText}>
                <Svg icon="clear3" size={pTd(16)} />
              </TouchableOpacity>
            ) : undefined
          }
          rightIconContainerStyle={styles.rightIconContainerStyle}
        />
        <TouchableOpacity onPress={navBack}>
          <TextM style={[FontStyles.font2, styles.cancelButton]}>{t('Cancel')}</TextM>
        </TouchableOpacity>
      </View>
      {/* <NoData noPic message="There is no search result." /> */}
      <CommonSection
        headerTitle="Records"
        data={[1]}
        clearCallback={() => {
          console.log('clear');
        }}
        renderItem={item => <RecordItem {...item} />}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  inputContainer: {
    ...GStyles.paddingArg(8, 20),
  },
  inputStyle: {
    width: pTd(280),
  },
  cancelButton: {
    paddingLeft: pTd(12),
    lineHeight: pTd(36),
  },
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
});
