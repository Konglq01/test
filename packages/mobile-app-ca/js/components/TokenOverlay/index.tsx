import React, { useState, useCallback, useEffect } from 'react';
import OverlayModal from 'components/OverlayModal';
import { FlatList, StyleSheet } from 'react-native';
import { TextXL } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import CommonInput from 'components/CommonInput';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';
import { AccountType } from '@portkey-wallet/types/wallet';
import TokenListItem from 'components/TokenListItem';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { screenHeight } from '@portkey-wallet/utils/mobile/device';
import { useLanguage } from 'i18n/hooks';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import useDebounce from 'hooks/useDebounce';
import useEffectOnce from 'hooks/useEffectOnce';
import { useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchAllTokenListAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import NoData from 'components/NoData';

type onFinishSelectTokenType = (tokenItem: TokenItemShowType) => void;
type TokenListProps = {
  account?: AccountType;
  onFinishSelectToken?: onFinishSelectTokenType;
};

const TokenList = ({ onFinishSelectToken }: TokenListProps) => {
  const { t } = useLanguage();

  const { tokenDataShowInMarket } = useAppCASelector(state => state.tokenManagement);
  const dispatch = useAppCommonDispatch();
  const chainIdList = useChainIdList();

  const [keyword, setKeyword] = useState('');

  const debounceKeyword = useDebounce(keyword, 800);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TokenListItem
        noBalanceShow
        key={`${item.symbol}${item.chainId}`}
        item={item}
        onPress={() => {
          OverlayModal.hide();
          onFinishSelectToken?.(item);
        }}
      />
    ),
    [onFinishSelectToken],
  );

  useEffect(() => {
    dispatch(fetchAllTokenListAsync({ chainIdArray: chainIdList, keyword: debounceKeyword }));
  }, [chainIdList, debounceKeyword, dispatch]);

  useEffectOnce(() => {
    if (tokenDataShowInMarket.length !== 0) return;
    dispatch(fetchAllTokenListAsync({ chainIdArray: chainIdList, keyword: debounceKeyword }));
  });

  return (
    <ModalBody modalBodyType="bottom" style={styles.modalStyle}>
      <TextXL style={styles.title}>{t('Select Token')}</TextXL>
      <CommonInput
        placeholder={t('Token Name')}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        inputStyle={styles.inputStyle}
        value={keyword}
        onChangeText={v => {
          setKeyword(v.trim());
        }}
      />
      {!!debounceKeyword && !tokenDataShowInMarket.length && <NoData noPic message={t('There is no search result.')} />}
      <FlatList
        style={styles.flatList}
        data={tokenDataShowInMarket || []}
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
