import { ChainItemType } from '@portkey/types/chain';
import { isIOS } from '@rneui/base';
import { defaultColors } from 'assets/theme';
import CommonButton from 'components/CommonButton';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import useKeyboardHeight from 'hooks/useKeyboardHeight';
import { useLanguage } from 'i18n/hooks';
import React, { memo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';
import ListEmptyComponent from '../ListEmptyComponent';
import NetworkItem from '../NetworkItem';
interface CustomScreenProps {
  networkList: ChainItemType[];
  isSearch?: boolean;
}
function CustomScreen({ networkList, isSearch }: CustomScreenProps) {
  const keyboardHeight = useKeyboardHeight();
  const { t } = useLanguage();
  return (
    <>
      <FlatList
        data={networkList}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={<ListEmptyComponent isSearch={isSearch} />}
        renderItem={({ item: chain }) => <NetworkItem chain={chain} isCustom />}
      />
      <CommonButton
        // eslint-disable-next-line react-native/no-inline-styles
        containerStyle={[styles.addButtonWrap, { bottom: isIOS && keyboardHeight ? keyboardHeight + 10 : 50 }]}
        buttonStyle={[styles.addButton]}
        onPress={() => navigationService.navigate('NetworkDetails')}>
        <Svg icon="add1" size={pTd(16)} color="#ffffff" />
        <TextM style={styles.addText}>{t('Add Network')}</TextM>
      </CommonButton>
    </>
  );
}

export default memo(CustomScreen);

const styles = StyleSheet.create({
  addButtonWrap: {
    height: pTd(50),
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
  },
  addButton: {
    borderRadius: pTd(6),
    color: defaultColors.font2,
    backgroundColor: defaultColors.bg5,
    width: pTd(126),
    height: pTd(40),
    fontSize: pTd(14),
  },
  addText: {
    marginLeft: pTd(8),
    color: defaultColors.font2,
  },
});
