import React, { useCallback } from 'react';
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
import { useWallet } from 'hooks/store';
import useRouterParams from '@portkey/hooks/useRouterParams';

type RouterParams = {
  contact?: ContactItemType;
};

const ContactDetail: React.FC = () => {
  const { contact } = useRouterParams<RouterParams>();
  const { t } = useLanguage();
  const { currentNetwork } = useWallet();
  const renderAddress = useCallback(
    (addressItem: AddressItem) => (
      <View key={addressItem.id} style={pageStyles.addressWrap}>
        <View style={pageStyles.addressInfo}>
          <TextM style={pageStyles.addressLabel}>
            ELF_{addressItem.address}_{addressItem.chainId}
          </TextM>
          <TextS style={FontStyles.font3}>AELF {currentNetwork}</TextS>
        </View>
        <Touchable
          style={GStyles.marginTop(12)}
          onPress={async () => {
            if (!addressItem.address) return;
            const isCopy = await setStringAsync(`ELF_${addressItem.address}_${addressItem.chainId}`);
            isCopy && CommonToast.success(t('Copied'));
          }}>
          <Svg icon="copy" size={pTd(16)} />
        </Touchable>
      </View>
    ),
    [currentNetwork, t],
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
          <TextXXL style={FontStyles.font5}>{contact?.index}</TextXXL>
        </View>
        <Text>{contact?.name}</Text>
      </View>
      <TextM style={[FontStyles.font3, pageStyles.titleWrap]}>{t('Address')}</TextM>

      <ScrollView alwaysBounceVertical={true}>
        <TouchableWithoutFeedback>
          <View>{contact?.addresses.map(addressItem => renderAddress(addressItem))}</View>
        </TouchableWithoutFeedback>
      </ScrollView>

      <CommonButton
        type="solid"
        containerStyle={GStyles.paddingTop(pTd(16))}
        onPress={() => {
          navigationService.navigate('ContactEdit', { contact });
        }}>
        {t('Edit')}
      </CommonButton>
    </PageContainer>
  );
};

export default ContactDetail;
