import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import PageContainer from 'components/PageContainer';
import { TextM, TextS, TextXXXL } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { View } from 'react-native';
import CommonButton from 'components/CommonButton';
import { useLanguage } from 'i18n/hooks';
import ActionSheet from 'components/ActionSheet';
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
import { useVerifierList } from '@portkey/hooks/hooks-ca/network';
import VerifierOverlay from '../components/VerifierOverlay';
import { VerifierImage } from '../components/VerifierImage';
import { LoginType } from '@portkey/types/types-ca/wallet';
import myEvents from 'utils/deviceEvent';

const ScrollViewProps = { disabled: true };
export default function SelectVerifier() {
  const { t } = useLanguage();
  const verifierList = useVerifierList();

  const [selectedVerifier, setSelectedVerifier] = useState(verifierList[0]);

  const { loginGuardianType } = useRouterParams<{ loginGuardianType?: string }>();
  const onConfirm = useCallback(async () => {
    ActionSheet.alert({
      title2: `${selectedVerifier.name} will send a verification code to ${loginGuardianType} to verify your email address.`,
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
              Loading.show();
              const req = await request.register.sendCode({
                baseURL: selectedVerifier.url,
                data: {
                  type: 0,
                  loginGuardianType,
                  managerUniqueId,
                },
              });

              if (req.verifierSessionId) {
                navigationService.navigate('VerifierDetails', {
                  loginGuardianType,
                  verifierSessionId: req.verifierSessionId,
                  managerUniqueId,
                  guardianItem: {
                    isLoginAccount: true,
                    verifier: selectedVerifier,
                    loginGuardianType,
                    guardiansType: LoginType.email,
                  },
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
  }, [loginGuardianType, selectedVerifier, t]);
  return (
    <PageContainer
      containerStyles={styles.containerStyles}
      scrollViewProps={ScrollViewProps}
      type="leftBack"
      titleDom
      leftCallback={() => {
        myEvents.clearSignupInput.emit();
        navigationService.goBack();
      }}>
      <View>
        <TextXXXL style={GStyles.textAlignCenter}>Select verifier</TextXXXL>
        <TextM style={[GStyles.textAlignCenter, FontStyles.font3, GStyles.marginTop(8)]}>
          The recovery of decentralized accounts requires approval from your verifiers
        </TextM>
        <ListItem
          onPress={() =>
            VerifierOverlay.showVerifierList({
              verifierList,
              selectedVerifier,
              callBack: setSelectedVerifier,
            })
          }
          titleLeftElement={<VerifierImage uri={selectedVerifier?.imageUrl} size={30} />}
          titleStyle={[GStyles.flexRow, GStyles.itemCenter]}
          titleTextStyle={styles.titleTextStyle}
          style={[styles.selectedItem, BorderStyles.border1]}
          title={selectedVerifier?.name}
          rightElement={<Svg size={pTd(16)} icon="down-arrow" />}
        />
        <TextM style={fonts.mediumFont}>Popular</TextM>
        <View style={styles.verifierRow}>
          {verifierList.map(item => {
            return (
              <Touchable style={GStyles.center} key={item.name} onPress={() => setSelectedVerifier(item)}>
                <VerifierImage uri={item.imageUrl} size={42} />
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
