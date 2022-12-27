import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { TextM, TextS, TextXXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import Svg from 'components/Svg';
import { defaultColors } from 'assets/theme';
import Touchable from 'components/Touchable';
import { View } from 'react-native';
import CommonButton from 'components/CommonButton';
import { useLanguage } from 'i18n/hooks';
import ActionSheet from 'components/ActionSheet';
import VerifierOverlay from 'components/VerifierOverlay';
import { BorderStyles, FontStyles } from 'assets/theme/styles';
import ListItem from 'components/ListItem';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import { isIos } from '@portkey/utils/mobile/device';
import navigationService from 'utils/navigationService';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { request } from 'api';
import CommonToast from 'components/CommonToast';
import Loading from 'components/Loading';
import { randomId } from '@portkey/utils';

const verifierList = [{ name: 'Portkey' }, { name: 'Binance' }, { name: 'Huobi' }];

const ScrollViewProps = { disabled: true };
export default function SelectVerifier() {
  const { t } = useLanguage();
  const [selectedVerifier, setSelectedVerifier] = useState(verifierList[0]);
  const { email } = useRouterParams<{ email?: string }>();
  const onConfirm = useCallback(async () => {
    ActionSheet.alert({
      title2: `Portkey will send a verification code to ${email} to verify your email address.`,
      buttons: [
        {
          title: t('Cancel'),
          // type: 'solid',
          type: 'outline',
        },
        {
          title: t('Confirm'),
          onPress: async () => {
            try {
              const managerUniqueId = randomId();
              // TODO:Confirm
              Loading.show();
              const req = await request.verify.sendCode({
                baseURL: 'http://192.168.66.135:5588/',
                data: {
                  type: 0,
                  loginGuardianType: email,
                  managerUniqueId,
                },
              });
              if (req.verifierSessionId) {
                navigationService.navigate('VerifierDetails', {
                  email,
                  verifierSessionId: req.verifierSessionId,
                  managerUniqueId,
                });
              } else {
                throw new Error('send fail');
              }
            } catch (error) {
              CommonToast.failError(error);
            }
            Loading.hide();
          },
        },
      ],
    });
  }, [email, t]);
  return (
    <PageContainer containerStyles={styles.containerStyles} scrollViewProps={ScrollViewProps} type="leftBack" titleDom>
      <View>
        <TextXXXL style={GStyles.textAlignCenter}>Select verifier</TextXXXL>
        <TextM style={[GStyles.textAlignCenter, FontStyles.font3, GStyles.marginTop(8)]}>
          The recovery of decentralized accounts requires the protection of verifiers
        </TextM>
        <ListItem
          onPress={() =>
            VerifierOverlay.showVerifierList({
              verifierList,
              selectedVerifier,
              callBack: setSelectedVerifier,
            })
          }
          titleLeftElement={<Svg icon="logo-icon" color={defaultColors.primaryColor} size={30} />}
          titleStyle={[GStyles.flexRow, GStyles.itemCenter]}
          titleTextStyle={styles.titleTextStyle}
          style={[styles.selectedItem, BorderStyles.border1]}
          title={selectedVerifier.name}
          rightElement={<Svg size={pTd(16)} icon="down-arrow" />}
        />
        <TextM style={fonts.mediumFont}>Popular</TextM>
        <View style={styles.verifierRow}>
          {verifierList.map(item => {
            return (
              <Touchable key={item.name} onPress={() => setSelectedVerifier(item)}>
                <Svg icon="logo-icon" color={defaultColors.primaryColor} size={40} />
                <TextS style={[FontStyles.font3, styles.verifierTitle]}>{item.name}</TextS>
              </Touchable>
            );
          })}
        </View>
      </View>
      <CommonButton onPress={onConfirm} type="primary">
        {t('Confirm')}
      </CommonButton>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    justifyContent: 'space-between',
    paddingBottom: isIos ? 16 : 40,
  },
  selectedItem: {
    borderWidth: 1,
    paddingVertical: 13,
    marginTop: 24,
    marginBottom: 48,
  },
  titleTextStyle: {
    marginLeft: pTd(8),
    fontSize: pTd(14),
  },
  verifierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  verifierTitle: {
    marginTop: 8,
    textAlign: 'center',
  },
});
