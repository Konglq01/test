import { TextM, TextXXXL } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GUARDIAN_EXPIRED_TIME, VERIFIER_EXPIRATION } from '@portkey/constants/misc';
import { ScrollView, StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { isIphoneX } from '@portkey/utils/mobile/device';
import { BorderStyles, FontStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { getApprovalCount } from '@portkey/utils/guardian';
import { VerificationType, VerifyStatus } from '@portkey/types/verifier';
import GuardianAccountItem, { GuardiansStatus, GuardiansStatusItem } from '../components/GuardianAccountItem';
import useEffectOnce from 'hooks/useEffectOnce';
import { randomId } from '@portkey/utils';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import navigationService from 'utils/navigationService';
import { LoginType, ManagerInfo } from '@portkey/types/types-ca/wallet';
import Touchable from 'components/Touchable';
import ActionSheet from 'components/ActionSheet';
import myEvents from 'utils/deviceEvent';
export default function GuardianApproval() {
  const { t } = useLanguage();

  const [managerUniqueId, setManagerUniqueId] = useState<string>();
  const [guardiansStatus, setApproved] = useState<GuardiansStatus>();
  const [isExpired, setIsExpired] = useState<boolean>();

  const guardianExpiredTime = useRef<number>();
  const { loginGuardianType, userGuardiansList } = useRouterParams<{
    loginGuardianType?: string;
    userGuardiansList?: UserGuardianItem[];
  }>();
  const approvedList = useMemo(() => {
    return Object.values(guardiansStatus || {}).filter(guardian => guardian.status === VerifyStatus.Verified);
  }, [guardiansStatus]);

  const setGuardianStatus = useCallback(
    (key: string, status: GuardiansStatusItem) => {
      if (key === 'resetGuardianApproval') {
        setApproved(undefined);
        guardianExpiredTime.current = undefined;
      } else {
        setApproved({ ...guardiansStatus, [key]: status });
      }
    },
    [guardiansStatus],
  );

  const guardianCount = useMemo(() => getApprovalCount(userGuardiansList?.length || 0), [userGuardiansList?.length]);
  const isSuccess = useMemo(() => guardianCount <= approvedList.length, [guardianCount, approvedList.length]);
  const onSetGuardianStatus = useCallback(
    (data: { key: string; status: GuardiansStatusItem }) => {
      setGuardianStatus(data.key, data.status);
      if (!guardianExpiredTime.current) guardianExpiredTime.current = new Date().getTime() + GUARDIAN_EXPIRED_TIME;
    },
    [setGuardianStatus],
  );
  useEffectOnce(() => {
    setManagerUniqueId(randomId());
    const listener = myEvents.setGuardianStatus.addListener(onSetGuardianStatus);
    const expiredTimer = setInterval(() => {
      if (guardianExpiredTime.current && new Date().getTime() > guardianExpiredTime.current) setIsExpired(true);
    }, 1000);
    return () => {
      listener.remove();
      expiredTimer && clearInterval(expiredTimer);
    };
  });
  return (
    <PageContainer
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.containerStyle}
      leftIconType="close"
      backTitle="Wallet Login"
      type="leftBack"
      titleDom
      hideTouchable>
      <View style={GStyles.flex1}>
        <TextXXXL style={GStyles.alignCenter}>{t(`Guardians' approval`)}</TextXXXL>
        <TextM style={[styles.expireText, GStyles.alignCenter, FontStyles.font3]}>
          Expire after {VERIFIER_EXPIRATION} hour
        </TextM>
        <View style={[styles.verifierBody, GStyles.flex1]}>
          <View style={[GStyles.itemCenter, GStyles.flexRow, BorderStyles.border6, styles.approvalTitleRow]}>
            <View style={[GStyles.itemCenter, GStyles.flexRow, styles.approvalRow]}>
              <TextM style={[FontStyles.font3, styles.approvalTitle]}>{`Guardians' approval`}</TextM>
              <Touchable
                onPress={() =>
                  ActionSheet.alert({
                    title2: `You will need a certain number of guardians to confirm your action. The requirements differ depending on your guardian counts. If the total number is less than or equal to 3, approval from all is needed. If that figure is greater than 3, approval from a minimum of 60% is needed.`,
                    buttons: [{ title: 'OK' }],
                  })
                }>
                <Svg color={FontStyles.font3.color} size={pTd(16)} icon="question-mark" />
              </Touchable>
            </View>
            <TextM>
              <TextM style={FontStyles.font4}>{approvedList.length ?? 0}</TextM>/{guardianCount.toFixed(0)}
            </TextM>
          </View>
          <View style={GStyles.flex1}>
            <ScrollView>
              {userGuardiansList?.map(item => {
                return (
                  <GuardianAccountItem
                    key={item.key}
                    guardianItem={item}
                    setGuardianStatus={setGuardianStatus}
                    managerUniqueId={managerUniqueId as string}
                    guardiansStatus={guardiansStatus}
                    isExpired={isExpired}
                    isSuccess={isSuccess}
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
      {!isExpired && (
        <CommonButton
          onPress={() => {
            navigationService.navigate('SetPin', {
              managerInfo: {
                verificationType: VerificationType.communityRecovery,
                loginGuardianType,
                type: LoginType.email,
                managerUniqueId,
              } as ManagerInfo,
              guardianCount,
            });
          }}
          disabled={!isSuccess}
          type="primary"
          title="Recover wallet"
        />
      )}
    </PageContainer>
  );
}
const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: 8,
    paddingBottom: isIphoneX ? 16 : 36,
    justifyContent: 'space-between',
  },
  expireText: {
    marginTop: 8,
  },
  verifierBody: {
    marginTop: 40,
  },
  approvalTitleRow: {
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  approvalRow: {
    paddingBottom: 12,
  },
  approvalTitle: {
    marginRight: pTd(7),
  },
});
