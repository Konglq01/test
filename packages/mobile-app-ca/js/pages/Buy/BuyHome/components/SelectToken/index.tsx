import React, { useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { TextL, TextM } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import CommonInput from 'components/CommonInput';
import { useGStyles } from 'assets/theme/useGStyles';
import { ModalBody } from 'components/ModalBody';
import { defaultColors } from 'assets/theme';
import CommonAvatar from 'components/CommonAvatar';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { chainShowText } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { FontStyles } from 'assets/theme/styles';

type ItemValueType = string;

type ItemTypeBase = {
  chainId: ChainId;
  symbol: string;
  name: string;
  [key: string]: any;
};

type SelectListProps<ItemType extends ItemTypeBase> = {
  value?: ItemValueType; // `${chainId} ${symbol}`
  list: Array<ItemType>;
  callBack: (item: ItemType) => void;
};

const SelectList = <ItemType extends ItemTypeBase>({ list, callBack, value }: SelectListProps<ItemType>) => {
  const { t } = useLanguage();
  const gStyle = useGStyles();
  const [keyWord, setKeyWord] = useState<string>('');
  const symbolImages = useSymbolImages();

  const _list = useMemo(() => {
    const _keyWord = keyWord?.trim();
    return _keyWord === '' ? list : list.filter(item => item.name === _keyWord);
  }, [keyWord, list]);

  return (
    <ModalBody style={gStyle.overlayStyle} title={t('Select Token')} modalBodyType="bottom">
      <View style={styles.titleWrap}>
        <CommonInput
          containerStyle={styles.titleInputWrap}
          inputContainerStyle={styles.titleInputWrap}
          inputStyle={styles.titleInput}
          leftIconContainerStyle={styles.titleIcon}
          value={keyWord}
          placeholder={t('Search Token')}
          onChangeText={setKeyWord}
        />
      </View>
      {_list.length ? (
        <ScrollView alwaysBounceVertical={false}>
          {_list.map(item => {
            return (
              <Touchable
                key={item.chainId}
                onPress={() => {
                  OverlayModal.hide();
                  callBack(item);
                }}>
                <View style={styles.itemRow}>
                  <CommonAvatar
                    hasBorder
                    title={item?.symbol}
                    avatarSize={pTd(32)}
                    svgName={item?.symbol === ELF_SYMBOL ? 'elf-icon' : undefined}
                    imageUrl={symbolImages[item?.symbol]}
                  />
                  <View style={styles.itemContent}>
                    <View>
                      <TextL>{item.name}</TextL>
                      <TextM style={FontStyles.font7}>{`${chainShowText(item.chainId)} ${item.chainId}`}</TextM>
                    </View>

                    {value !== undefined && value === `${item.chainId} ${item.symbol}` && (
                      <Svg iconStyle={styles.itemIcon} icon="selected" size={pTd(24)} />
                    )}
                  </View>
                </View>
              </Touchable>
            );
          })}
        </ScrollView>
      ) : (
        <TextL style={styles.noResult}>{t('No results found')}</TextL>
      )}
    </ModalBody>
  );
};

const showList = <ItemType extends ItemTypeBase>(params: SelectListProps<ItemType>) => {
  Keyboard.dismiss();
  OverlayModal.show(<SelectList<ItemType> {...params} />, {
    position: 'bottom',
  });
};

export default {
  showList,
};

const styles = StyleSheet.create({
  titleWrap: {
    paddingHorizontal: pTd(16),
    marginBottom: pTd(8),
  },
  titleLabel: {
    textAlign: 'center',
    marginVertical: pTd(16),
  },
  titleInputWrap: {
    height: pTd(44),
  },
  titleInput: {
    fontSize: pTd(14),
  },
  titleIcon: {
    marginLeft: pTd(16),
  },
  itemRow: {
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
    marginHorizontal: pTd(20),
  },
  itemContent: {
    flex: 1,
    height: pTd(72),
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: pTd(16),
  },
  itemIcon: {
    position: 'absolute',
    right: 0,
  },
  noResult: {
    lineHeight: pTd(22),
    textAlign: 'center',
    marginVertical: pTd(60),
    color: defaultColors.font7,
  },
});
