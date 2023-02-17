import React, { useState, useCallback, useEffect } from 'react';
import OverlayModal from 'components/OverlayModal';
import { FlatList, StyleSheet } from 'react-native';
import { TextXL } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import CommonInput from 'components/CommonInput';
import { useAppCASelector } from '@portkey/hooks/hooks-ca';
import { TokenItemShowType } from '@portkey/types/types-eoa/token';
import { filterTokenList } from '@portkey/utils/token';
import { AccountType } from '@portkey/types/wallet';
import TokenListItem from 'components/TokenListItem';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { screenHeight } from '@portkey/utils/mobile/device';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch } from '@portkey/hooks';
import useDebounce from 'hooks/useDebounce';
import useEffectOnce from 'hooks/useEffectOnce';
import { fetchTokenListAsync } from '@portkey/store/store-ca/assets/slice';
import { useCaAddresses, useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';

type onFinishSelectTokenType = (tokenItem: TokenItemShowType) => void;
type TokenListProps = {
  account?: AccountType;
  onFinishSelectToken?: onFinishSelectTokenType;
};

const TokenList = ({ onFinishSelectToken, account }: TokenListProps) => {
  const { t } = useLanguage();

  const { accountToken } = useAppCASelector(state => state.assets);
  const dispatch = useAppCommonDispatch();
  const currentWalletInfo = useCurrentWalletInfo();
  const caAddresses = useCaAddresses();

  const [listShow, setListShow] = useState<any[]>([]);

  const [filterListInfo, setFilterListInfo] = useState({
    pageSize: 10,
    pageNum: 1,
    keyword: '',
    list: [],
    total: 0,
    isLoading: false,
  });

  const debounceKeyword = useDebounce(filterListInfo.keyword, 800);

  const renderItem = useCallback(
    ({ item }: { item: TokenItemShowType }) => {
      return (
        <TokenListItem
          item={item}
          onPress={() => {
            OverlayModal.hide();
            onFinishSelectToken?.(item);
          }}
        />
      );
    },
    [onFinishSelectToken],
  );

  useEffect(() => {
    console.log('enter ' + debounceKeyword);
  }, [debounceKeyword]);

  useEffect(() => {
    setListShow(accountToken.accountTokenList);
  }, [accountToken.accountTokenList]);

  useEffectOnce(() => {
    if (accountToken.accountTokenList.length !== 0) return;

    dispatch(fetchTokenListAsync({ caAddresses }));
  });

  return (
    <ModalBody modalBodyType="bottom" style={styles.modalStyle}>
      <TextXL style={styles.title}>{t('Select Token')}</TextXL>
      <CommonInput
        placeholder={t('Token Name')}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        value={filterListInfo.keyword}
        onChangeText={v => {
          setFilterListInfo({
            ...filterListInfo,
            keyword: v.trim(),
          });
        }}
      />
      <FlatList
        style={styles.flatList}
        data={listShow.filter(ele => !!currentWalletInfo?.[ele?.chainId])}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id || ''}
      />
    </ModalBody>
  );
};

export const showTokenList = (props: TokenListProps) => {
  OverlayModal.show(<TokenList {...props} />, {
    position: 'bottom',
  });
};

export default {
  showTokenList,
};

export const styles = StyleSheet.create({
  modalStyle: {
    height: screenHeight - pTd(100),
  },
  title: {
    textAlign: 'center',
    color: defaultColors.font5,
    height: pTd(22),
    lineHeight: pTd(22),
    marginTop: pTd(17),
    marginBottom: pTd(16),
    ...fonts.mediumFont,
  },
  containerStyle: {
    marginLeft: pTd(16),
    width: pTd(343),
    marginBottom: pTd(8),
  },
  inputContainerStyle: {
    height: pTd(44),
  },
  inputStyle: {
    height: pTd(44),
  },
  flatList: {
    marginTop: pTd(8),
  },
});
