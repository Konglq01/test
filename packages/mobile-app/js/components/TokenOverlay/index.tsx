import React, { useMemo, useState, useCallback, useEffect } from 'react';
import OverlayModal from 'components/OverlayModal';
import { FlatList, StyleSheet } from 'react-native';
import { TextXL } from 'components/CommonText';
import { ModalBody } from 'components/ModalBody';
import CommonInput from 'components/CommonInput';
import { useAppEOASelector } from '@portkey-wallet/hooks';
import { useAllAccountTokenList } from '@portkey-wallet/hooks/hooks-eoa/useToken';
import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';
import { filterTokenList } from '@portkey-wallet/utils/token';
// import TokenShowItem from 'pages/Token/TokenShowItem';
import { AccountType } from '@portkey-wallet/types/wallet';
import TokenListItem from 'components/TokenListItem';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { screenHeight } from 'utils/device';
import { useGetELFRateQuery } from '@portkey-wallet/store/rate/api';
import { useLanguage } from 'i18n/hooks';

type onFinishSelectTokenType = (tokenItem: TokenItemShowType) => void;
type TokenListProps = {
  account?: AccountType;
  onFinishSelectToken?: onFinishSelectTokenType;
};

const TokenList = ({ onFinishSelectToken, account }: TokenListProps) => {
  const { t } = useLanguage();
  const addedTokenData = useAllAccountTokenList();
  const { data: rate } = useGetELFRateQuery({});

  const { balances } = useAppEOASelector(state => state.tokenBalance);
  const { currentAccount } = useAppEOASelector(state => state.wallet);
  const { currentChain } = useAppEOASelector(state => state.chain);

  const [keyword, setKeyword] = useState('');
  const [listShow, setListShow] = useState<TokenItemShowType[]>([]);

  console.log('account!!!!', account);

  const selectedChain = currentChain;

  const selectedAccount = useMemo(() => account ?? currentAccount, [account, currentAccount]);
  const selectedAccountTokenList = useMemo(() => {
    if (!selectedAccount) return;

    return addedTokenData[selectedChain?.rpcUrl][selectedAccount?.address];
  }, [selectedAccount, addedTokenData, selectedChain?.rpcUrl]);

  const list: TokenItemShowType[] = useMemo(() => {
    if (!selectedAccount) return [];

    const balanceObject = balances?.[selectedChain?.rpcUrl]?.[selectedAccount?.address] || {};

    const result =
      selectedAccountTokenList?.map(ele => {
        return { ...ele, balance: balanceObject?.[ele.symbol] };
      }) ?? [];
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balances, selectedChain?.rpcUrl, selectedAccount?.address, selectedAccountTokenList]);

  const renderItem = useCallback(
    ({ item }: { item: TokenItemShowType }) => {
      return (
        <TokenListItem
          symbol={item.symbol}
          icon={'aelf-avatar'}
          rate={rate as { USDT: number }}
          item={item}
          onPress={() => {
            OverlayModal.hide();
            onFinishSelectToken?.(item);
          }}
        />
      );
    },
    [onFinishSelectToken, rate],
  );

  useEffect(() => {
    return setListShow(filterTokenList(list, keyword));
  }, [keyword, list]);

  return (
    <ModalBody modalBodyType="bottom" style={styles.modalStyle}>
      <TextXL style={styles.title}>{t('Select Asset')}</TextXL>
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
      <FlatList
        style={styles.flatList}
        data={listShow || []}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.symbol || ''}
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
