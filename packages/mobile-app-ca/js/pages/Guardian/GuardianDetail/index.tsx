import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pageStyles } from './style';
import { useLanguage } from 'i18n/hooks';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import CommonSwitch from 'components/CommonSwitch';
import ActionSheet from 'components/ActionSheet';
import { useGuardiansInfo } from 'hooks/store';
import { useGetHolderInfo } from 'hooks/guardian';
import Loading from 'components/Loading';
import { randomId } from '@portkey/utils';
import { request } from 'api';
import CommonToast from 'components/CommonToast';
import { VerificationType } from '@portkey/types/verifier';

interface GuardianDetailProps {
  route?: any;
}

const GuardianDetail: React.FC<GuardianDetailProps> = ({ route }) => {
  const { t } = useLanguage();
  const { params } = route;
  const getHolderInfo = useGetHolderInfo();
  const { userGuardiansList } = useGuardiansInfo();

  const guardian = useMemo<UserGuardianItem | undefined>(
    () => (params?.guardian ? JSON.parse(params.guardian) : undefined),
    [params],
  );

  const cancelLoginAccount = useCallback(async () => {
    // TODO: add cancel login account
  }, []);

  const setLoginAccount = useCallback(async () => {
    if (!guardian) return;
    try {
      const managerUniqueId = randomId();
      Loading.show();
      const req = await request.verification.sendCode({
        baseURL: guardian.verifier?.url,
        data: {
          type: guardian.guardiansType,
          loginGuardianType: guardian.loginGuardianType,
          managerUniqueId,
        },
      });
      if (req.verifierSessionId) {
        navigationService.navigate('VerifierDetails', {
          loginGuardianType: guardian.loginGuardianType,
          verifierSessionId: req.verifierSessionId,
          managerUniqueId,
          verificationType: VerificationType.setLoginAccount,
          guardianItem: guardian,
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
      const email = guardian.loginGuardianType;

      if (value === false) {
        const loginIndex = userGuardiansList.findIndex(
          item =>
            item.isLoginAccount &&
            !(
              item.guardiansType === guardian.guardiansType &&
              item.loginGuardianType === guardian.loginGuardianType &&
              item.verifier?.url === guardian.verifier?.url
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

        cancelLoginAccount();
        return;
      }

      Loading.show();
      try {
        const holderInfo = await getHolderInfo({ loginGuardianType: guardian.loginGuardianType });
        if (holderInfo.guardians) {
          Loading.hide();
          ActionSheet.alert({
            title2: t(`This account address is already a login account of other wallets and cannot be used`),
            buttons: [
              {
                title: t('Close'),
              },
            ],
          });
          return;
        }
      } catch (error) {
        console.debug(error, '====error');
      }

      ActionSheet.alert({
        title2: `Portkey will send a verification code to ${email} to verify your email address.`,
        buttons: [
          {
            title: t('Cancel'),
            type: 'outline',
          },
          {
            title: t('Confirm'),
            onPress: () => {
              setLoginAccount();
            },
          },
        ],
      });
    },
    [cancelLoginAccount, getHolderInfo, guardian, setLoginAccount, t, userGuardiansList],
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
            <TextM>{guardian?.loginGuardianType || ''}</TextM>
          </View>
          <View style={pageStyles.verifierInfoWrap}>
            {/* TODO: dynamic logo icon */}
            <Svg
              iconStyle={GStyles.marginRight(8)}
              icon="logo-icon"
              color={defaultColors.primaryColor}
              size={pTd(30)}
            />
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
          {t('The master account will be able to log in and control all your assets')}
        </TextM>
      </View>
      <CommonButton
        type="primary"
        onPress={() => {
          navigationService.navigate('GuardianEdit', { guardian: JSON.parse(JSON.stringify(guardian)), isEdit: true });
        }}>
        {t('Edit')}
      </CommonButton>
    </PageContainer>
  );
};

export default GuardianDetail;
