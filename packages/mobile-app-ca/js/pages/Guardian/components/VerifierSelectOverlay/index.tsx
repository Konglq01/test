import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, ScrollView, View } from 'react-native';
import Touchable from 'components/Touchable';
import styles from './styles';
import GStyles from 'assets/theme/GStyles';
import Svg from 'components/Svg';
import { TextL, TextXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import OverlayBody from 'components/OverlayModal/OverlayBody';
import { VerifierImage } from '../VerifierImage';

type ValueType = string | number;
type DefaultValueType = string;

type ItemTypeBase<T extends ValueType = DefaultValueType> = {
  url: T;
  [key: string]: any;
};

type SelectListProps<ItemType extends ItemTypeBase<ItemValueType>, ItemValueType extends ValueType> = {
  url?: ItemValueType;
  list: Array<ItemType>;
  callBack: (item: ItemType) => void;
  labelAttrName?: string;
};

const SelectList = <ItemType extends ItemTypeBase<ItemValueType>, ItemValueType extends ValueType>({
  list,
  callBack,
  url,
  labelAttrName = 'url',
}: SelectListProps<ItemType, ItemValueType>) => {
  const { t } = useLanguage();

  return (
    <OverlayBody>
      <TextXL style={styles.typeOverlayTitleLabel}>{t('Select verifiers')}</TextXL>
      <ScrollView alwaysBounceVertical={false}>
        {list.map(item => {
          return (
            <Touchable
              key={item.url}
              onPress={() => {
                OverlayModal.hide();
                callBack(item);
              }}>
              <View style={[GStyles.paddingLeft(24), styles.itemRow]}>
                <VerifierImage style={GStyles.marginRight(12)} size={pTd(36)} uri={item.imageUrl} />

                <View style={styles.itemContent}>
                  <TextL>{item[labelAttrName]}</TextL>
                  {url !== undefined && url === item.url && (
                    <Svg iconStyle={styles.itemIcon} icon="selected" size={pTd(24)} />
                  )}
                </View>
              </View>
            </Touchable>
          );
        })}
      </ScrollView>
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
