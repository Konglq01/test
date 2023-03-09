import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { TextL, TextM } from 'components/CommonText';
import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pageStyles } from './style';
import { useLanguage } from 'i18n/hooks';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import CommonSwitch from 'components/CommonSwitch';
import ActionSheet from 'components/ActionSheet';
import { useGuardiansInfo } from 'hooks/store';
import { useGetGuardiansInfo } from 'hooks/guardian';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import { VerificationType } from '@portkey-wallet/types/verifier';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import myEvents from 'utils/deviceEvent';
import { VerifierImage } from '../components/VerifierImage';
import { cancelLoginAccount } from 'utils/guardian';
import { useGetCurrentCAContract } from 'hooks/contract';
import { LoginStrType } from '@portkey-wallet/constants/constants-ca/guardian';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network-test2';
import { verification } from 'utils/api';
import { RouteProp, useRoute } from '@react-navigation/native';
import fonts from 'assets/theme/fonts';

type RouterParams = {
  guardian?: UserGuardianItem;
};

export default function GuardianDetail() {
  const {
    params: { guardian },
  } = useRoute<RouteProp<{ params: RouterParams }>>();
  const { t } = useLanguage();
  const getGuardiansInfo = useGetGuardiansInfo();
  const { userGuardiansList } = useGuardiansInfo();
  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const getCurrentCAContract = useGetCurrentCAContract();

  const onCancelLoginAccount = useCallback(async () => {
    if (!managerAddress || !caHash || !guardian) return;
    Loading.show();
    try {
      const caContract = await getCurrentCAContract();
      const req = await cancelLoginAccount(caContract, managerAddress, caHash, guardian);
      if (req && !req.error) {
        myEvents.refreshGuardiansList.emit();
        navigationService.navigate('GuardianDetail', {
          guardian: { ...guardian, isLoginAccount: false },
        });
      } else {
        CommonToast.fail(req?.error?.message || '');
      }
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [caHash, getCurrentCAContract, guardian, managerAddress]);

  const setLoginAccount = useCallback(async () => {
    if (!guardian) return;
    try {
      Loading.show();
      const req = await verification.sendVerificationCode({
        params: {
          type: LoginStrType[guardian.guardianType],
          guardianIdentifier: guardian.guardianAccount,
          verifierId: guardian.verifier?.id,
          chainId: DefaultChainId,
        },
      });
      if (req.verifierSessionId) {
        navigationService.navigate('VerifierDetails', {
          guardianItem: guardian,
          requestCodeResult: {
            verifierSessionId: req.verifierSessionId,
          },
          verificationType: VerificationType.setLoginAccount,
        });
      } else {
        console.log('send fail');
      }
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [guardian]);

  const onLoginAccountChange = useCallback(
    async (value: boolean) => {
      if (guardian === undefined || userGuardiansList === undefined) return;

      if (!value) {
        const loginIndex = userGuardiansList.findIndex(
          item =>
            item.isLoginAccount &&
            !(
              item.guardianType === guardian.guardianType &&
              item.guardianAccount === guardian.guardianAccount &&
              item.verifier?.id === guardian.verifier?.id
            ),
        );
        if (loginIndex === -1) {
          ActionSheet.alert({
            title2: t('This guardian is the only login account and cannot be turned off'),
            buttons: [
              {
                title: t('Close'),
              },
            ],
          });
          return;
        }
        onCancelLoginAccount();
        return;
      }

      const loginIndex = userGuardiansList.findIndex(
        item =>
          item.isLoginAccount &&
          item.guardianType === guardian.guardianType &&
          item.guardianAccount === guardian.guardianAccount &&
          item.verifier?.id !== guardian.verifier?.id,
      );
      if (loginIndex === -1) {
        Loading.show();
        try {
          const guardiansInfo = await getGuardiansInfo({ guardianIdentifier: guardian.guardianAccount });
          if (guardiansInfo?.guardianList?.guardians?.length) {
            Loading.hide();
            ActionSheet.alert({
              title2: t(`This account address is already a login account and cannot be used`),
              buttons: [
                {
                  title: t('Close'),
                },
              ],
            });
            return;
          }
        } catch (error: any) {
          if (error.code !== '3002') {
            CommonToast.fail('Setup failed');
            return;
          }
        } finally {
          Loading.hide();
        }
      }

      ActionSheet.alert({
        title2: (
          <Text>
            <TextL>{`${guardian.verifier?.name} will send a verification code to `}</TextL>
            <TextL style={fonts.mediumFont}>{guardian.guardianAccount}</TextL>
            <TextL>{` to verify your email address.`}</TextL>
          </Text>
        ),
        buttons: [
          {
            title: t('Cancel'),
            type: 'outline',
          },
          {
            title: t('Confirm'),
            onPress: setLoginAccount,
          },
        ],
      });
    },
    [getGuardiansInfo, guardian, onCancelLoginAccount, setLoginAccount, t, userGuardiansList],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={t('Guardians')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.contentWrap}>
        <View style={pageStyles.guardianInfoWrap}>
          <View style={pageStyles.guardianTypeWrap}>
            <TextM>{guardian?.guardianAccount || ''}</TextM>
          </View>
          <View style={pageStyles.verifierInfoWrap}>
            <VerifierImage style={GStyles.marginRight(8)} size={pTd(30)} uri={guardian?.verifier?.imageUrl} />
            <TextM>{guardian?.verifier?.name || ''}</TextM>
          </View>
        </View>

        <View style={pageStyles.loginSwitchWrap}>
          <TextM>{t('Login account')}</TextM>
          <CommonSwitch
            value={guardian === undefined ? false : guardian.isLoginAccount}
            onValueChange={onLoginAccountChange}
          />
        </View>

        <TextM style={pageStyles.tips}>
          {t('The login account will be able to log in and control all your assets')}
        </TextM>
      </View>
      {userGuardiansList && userGuardiansList.length > 1 && (
        <CommonButton
          type="primary"
          onPress={() => {
            navigationService.navigate('GuardianEdit', {
              guardian: JSON.parse(JSON.stringify(guardian)),
              isEdit: true,
            });
          }}>
          {t('Edit')}
        </CommonButton>
      )}
    </PageContainer>
  );
}
