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

interface GuardianDetailProps {
  route?: any;
}

const GuardianDetail: React.FC<GuardianDetailProps> = ({ route }) => {
  const { t } = useLanguage();
  const { params } = route;
  const { userGuardiansList } = useGuardiansInfo();

  const guardian = useMemo<UserGuardianItem | undefined>(
    () => (params?.guardian ? JSON.parse(params.guardian) : undefined),
    [params],
  );

  const onLoginAccountChange = useCallback(
    (value: boolean) => {
      if (guardian === undefined || userGuardiansList === undefined) return;
      const email = guardian.loginGuardianType;

      if (value === false) {
        const loginIndex = userGuardiansList.findIndex(
          item =>
            item.isLoginAccount &&
            !(
              item.guardiansType === guardian.guardiansType &&
              item.loginGuardianType === guardian.loginGuardianType &&
              item.verifier?.id === guardian.verifier?.id
            ),
        );
        if (loginIndex === -1) {
          ActionSheet.alert({
            title2: t('This guardian is the only Login account and cannot be turn off'),
            buttons: [
              {
                title: t('Close'),
              },
            ],
          });
          return;
        }

        // TODO: add cancel login account
        return;
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
              // TODO: add set login account
              navigationService.navigate('VerifierDetails', { email });
            },
          },
        ],
      });
    },
    [guardian, t, userGuardiansList],
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
          {t('The login account will be able to log in and control all your assets')}
        </TextM>
      </View>
      <CommonButton
        type="primary"
        onPress={() => {
          navigationService.navigate('GuardianEdit', { guardian: JSON.stringify(guardian) });
        }}>
        {t('Edit')}
      </CommonButton>
    </PageContainer>
  );
};

export default GuardianDetail;
