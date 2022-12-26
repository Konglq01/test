import React, { useCallback, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { pageStyles } from './style';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { AddressItem, ContactItemType } from '@portkey/types/types-ca/contact';
import Touchable from 'components/Touchable';
import { setStringAsync } from 'expo-clipboard';
import CommonToast from 'components/CommonToast';
import { TextM, TextS, TextXXL } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { FontStyles } from 'assets/theme/styles';
import { getChainListAsync } from '@portkey/store/store-ca/wallet/actions';
import { useAppDispatch } from 'store/hooks';
import { useWallet } from 'hooks/store';
import { ChainItemType } from '@portkey/store/store-ca/wallet/type';

interface ContactDetailProps {
  route?: any;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ route }) => {
  const { t } = useLanguage();
  const { params } = route;
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(getChainListAsync());
  }, [appDispatch]);
  const { chainList, currentNetwork } = useWallet();

  const chainMap = useMemo(() => {
    const _chainMap: { [k: string]: ChainItemType } = {};
    chainList.forEach(item => {
      _chainMap[item.chainId] = item;
    });
    return _chainMap;
  }, [chainList]);

  const contact = useMemo<ContactItemType>(() => params.contact && JSON.parse(params.contact), [params]);

  const renderAddress = useCallback(
    (addressItem: AddressItem) => (
      <View key={addressItem.id} style={pageStyles.addressWrap}>
        <View style={pageStyles.addressInfo}>
          <TextM style={pageStyles.addressLabel}>
            ELF_{addressItem.address}_{chainMap[addressItem.chainId]?.chainId}
          </TextM>
          <TextS style={FontStyles.font3}>AELF {currentNetwork}</TextS>
        </View>
        <Touchable
          style={GStyles.marginTop(12)}
          onPress={async () => {
            if (!addressItem.address) return;
            const isCopy = await setStringAsync(`ELF_${addressItem.address}_${addressItem.chainId}`);
            isCopy && CommonToast.success(t('Copy Success'));
          }}>
          <Svg icon="copy" size={pTd(16)} />
        </Touchable>
      </View>
    ),
    [chainMap, currentNetwork, t],
  );

  return (
    <PageContainer
      titleDom={'Details'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <TextM style={[FontStyles.font3, pageStyles.titleWrap]}>{t('Name')}</TextM>
      <View style={pageStyles.contactInfo}>
        <View style={pageStyles.contactAvatar}>
          <TextXXL style={FontStyles.font5}>{contact.index}</TextXXL>
        </View>
        <Text>{contact.name}</Text>
      </View>
      <TextM style={[FontStyles.font3, pageStyles.titleWrap]}>{t('Address')}</TextM>

      <ScrollView alwaysBounceVertical={true}>
        <TouchableWithoutFeedback>
          <View>{contact.addresses.map(addressItem => renderAddress(addressItem))}</View>
        </TouchableWithoutFeedback>
      </ScrollView>

      <CommonButton
        type="solid"
        containerStyle={GStyles.paddingTop(pTd(16))}
        onPress={() => {
          navigationService.navigate('ContactEdit', { contact: JSON.stringify(contact) });
        }}>
        {t('Edit')}
      </CommonButton>
    </PageContainer>
  );
};

export default ContactDetail;
