import { TextM, TextXXXL } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo, useState } from 'react';
import { VERIFIER_EXPIRATION } from '@portkey/constants/misc';
import { DeviceEventEmitter, ScrollView, StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { isIphoneX } from '@portkey/utils/mobile/device';
import { BorderStyles, FontStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { getApprovalCount } from '@portkey/utils/guardian';
import { VerificationType, VerifyStatus } from '@portkey/types/verifier';
import GuardianAccountItem, { GuardiansStatus, GuardiansStatusItem } from '../GuardianAccountItem';
import useEffectOnce from 'hooks/useEffectOnce';
import { randomId } from '@portkey/utils';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import navigationService from 'utils/navigationService';
import { LoginType, ManagerInfo } from '@portkey/types/types-ca/wallet';

export default function GuardianApproval() {
  const [managerUniqueId, setManagerUniqueId] = useState<string>();
  console.log(managerUniqueId, '====managerUniqueId');

  const { loginGuardianType, userGuardiansList } = useRouterParams<{
    loginGuardianType?: string;
    userGuardiansList?: UserGuardianItem[];
  }>();
  const [guardiansStatus, setApproved] = useState<GuardiansStatus>();
  console.log(guardiansStatus, '=====guardiansStatus');

  const approvedList = useMemo(() => {
    return Object.values(guardiansStatus || {}).filter(guardian => guardian.status === VerifyStatus.Verified);
  }, [guardiansStatus]);

  const setGuardianStatus = useCallback(
    (key: string, status: GuardiansStatusItem) => {
      setApproved({ ...guardiansStatus, [key]: status });
    },
    [guardiansStatus],
  );

  console.log(userGuardiansList, '====userGuardiansList');
  const { t } = useLanguage();
  const guardianCount = useMemo(() => getApprovalCount(userGuardiansList?.length || 0), [userGuardiansList?.length]);
  const isSuccess = useMemo(() => guardianCount <= approvedList.length, [guardianCount, approvedList.length]);
  console.log(isSuccess, '====isSuccess');

  useEffectOnce(() => {
    setManagerUniqueId(randomId());
    const listener = DeviceEventEmitter.addListener(
      'setGuardianStatus',
      (data: { key: string; status: GuardiansStatusItem }) => {
        console.log(data, '=====data');
        setGuardianStatus(data.key, data.status);
      },
    );
    return () => {
      listener.remove();
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
        <TextXXXL style={GStyles.alignCenter}>{t('Guardian approval')}</TextXXXL>
        <TextM style={[styles.expireText, GStyles.alignCenter, FontStyles.font3]}>
          Expire after {VERIFIER_EXPIRATION} hour
        </TextM>
        <View style={[styles.verifierBody, GStyles.flex1]}>
          <View style={[GStyles.itemCenter, GStyles.flexRow, BorderStyles.border6, styles.approvalTitleRow]}>
            <View style={[GStyles.itemCenter, GStyles.flexRow, styles.approvalRow]}>
              <TextM style={[FontStyles.font3, styles.approvalTitle]}>Guardian approvals</TextM>
              <Svg color={FontStyles.font3.color} size={pTd(16)} icon="question-mark" />
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
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
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
