import React, { useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, View } from 'react-native';
import Touchable from 'components/Touchable';
import styles from './styles';
import GStyles from 'assets/theme/GStyles';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import { TextL, TextXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import CommonInput from 'components/CommonInput';
import OverlayBody from 'components/OverlayModal/OverlayBody';

type ValueType = string | number;
type DefaultValueType = string;

type ItemTypeBase<T extends ValueType = DefaultValueType> = {
  chainId: T;
  [key: string]: any;
};

type SelectListProps<ItemType extends ItemTypeBase<ItemValueType>, ItemValueType extends ValueType> = {
  value?: ItemValueType;
  list: Array<ItemType>;
  callBack: (item: ItemType) => void;
  labelAttrName?: string;
};

const SelectList = <ItemType extends ItemTypeBase<ItemValueType>, ItemValueType extends ValueType>({
  list,
  callBack,
  value,
  labelAttrName = 'chainId',
}: SelectListProps<ItemType, ItemValueType>) => {
  const { t } = useLanguage();
  const [keyWord, setKeyWord] = useState<string>('');

  const _list = useMemo(() => {
    const _keyWord = keyWord?.trim();
    return _keyWord === '' ? list : list.filter(item => item[labelAttrName] === _keyWord);
  }, [keyWord, labelAttrName, list]);

  return (
    <OverlayBody style={styles.overlayWrap}>
      <View style={styles.titleWrap}>
        <TextXL style={styles.titleLabel}>{t('Select Network')}</TextXL>
        <CommonInput
          containerStyle={styles.titleInputWrap}
          inputContainerStyle={styles.titleInputWrap}
          inputStyle={styles.titleInput}
          leftIconContainerStyle={GStyles.marginLeft(16)}
          value={keyWord}
          placeholder={t('Search network')}
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
                <View style={[GStyles.paddingLeft(20), styles.itemRow]}>
                  <Svg icon="logo-icon" color={defaultColors.primaryColor} size={pTd(40)} />
                  <View style={styles.itemContent}>
                    <TextL>{item[labelAttrName]}</TextL>
                    {value !== undefined && value === item.chainId && (
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
    </OverlayBody>
  );
};

const showList = <ItemType extends ItemTypeBase<ItemValueType>, ItemValueType extends ValueType = DefaultValueType>(
  params: SelectListProps<ItemType, ItemValueType>,
) => {
  Keyboard.dismiss();
  OverlayModal.show(<SelectList<ItemType, ItemValueType> {...params} />, {
    position: 'bottom',
  });
};

export default {
  showList,
};
