import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
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
import NoData from 'components/NoData';
import fonts from 'assets/theme/fonts';
import RecordSection from '../components/RecordSection';
import GameSection from '../components/GameSection';
import { GamesList } from '../DiscoverHome/GameData';
import { IGameListItemType } from '@portkey-wallet/types/types-ca/discover';
import { isValidUrl } from '@portkey-wallet/utils/reg';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { addRecordsItem } from '@portkey-wallet/store/store-ca/discover/slice';

export default function DiscoverSearch() {
  const { t } = useLanguage();

  const dispatch = useAppCommonDispatch();

  const iptRef = useRef<any>();
  const [value, setValue] = useState<string>('');
  const [showRecord, setShowRecord] = useState<boolean>(true);
  const [filterGameList, setFilterGameList] = useState<IGameListItemType[]>(GamesList);

  const navBack = useCallback(() => {
    navigationService.goBack();
  }, []);

  const clearText = useCallback(() => setValue(''), []);

  useEffect(() => {
    if (!value) setShowRecord(true);
  }, [value]);

  const onSearch = useCallback(() => {
    const newValue = value.trim().replace(' ', '');
    // if URL is valid, navigate to webview
    if (isValidUrl(newValue)) {
      dispatch(addRecordsItem({ name: newValue, url: newValue }));
      navigationService.navigate('ViewOnWebView', { url: newValue });
      setShowRecord(true);
    } else {
      // else search in game list
      const filterList = GamesList.filter(item => item.name.replace(' ', '').includes(newValue));
      setFilterGameList(filterList);
      setShowRecord(false);
    }
  }, [dispatch, value]);

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
          onSubmitEditing={onSearch}
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
      {showRecord ? <RecordSection /> : <GameSection data={filterGameList} />}
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
  rightIconContainerStyle: {
    marginRight: pTd(10),
  },
});
