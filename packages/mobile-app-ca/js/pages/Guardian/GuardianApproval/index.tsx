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
import { ApprovalType, VerificationType, VerifyStatus } from '@portkey/types/verifier';
import GuardianAccountItem, { GuardiansStatus, GuardiansStatusItem } from '../GuardianAccountItem';
import useEffectOnce from 'hooks/useEffectOnce';
import { randomId } from '@portkey/utils';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import navigationService from 'utils/navigationService';
import { LoginType, ManagerInfo } from '@portkey/types/types-ca/wallet';
import Touchable from 'components/Touchable';
import ActionSheet from 'components/ActionSheet';
import myEvents from 'utils/deviceEvent';
import Loading from 'components/Loading';
import { getELFContract } from 'contexts/utils';
import { useCurrentChain } from '@portkey/hooks/hooks-ca/chainList';
import { useCredentials, useGuardiansInfo } from 'hooks/store';
import { getWallet } from 'utils/redux';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';

export interface EditGuardianParamsType {
  signature: string;
  verifierDoc: string;
}

type RouterParams = {
  loginGuardianType?: string;
  userGuardiansList?: UserGuardianItem[];
  approvalType?: ApprovalType;
  guardianItem?: UserGuardianItem;
  editGuardianParams?: EditGuardianParamsType;
  managerUniqueId?: string;
};

export default function GuardianApproval() {
  const {
    loginGuardianType,
    userGuardiansList: paramUserGuardiansList,
    approvalType = ApprovalType.register,
    guardianItem,
    editGuardianParams,
    managerUniqueId: paramManagerUniqueId,
  } = useRouterParams<RouterParams>();

  const { userGuardiansList: storeUserGuardiansList } = useGuardiansInfo();

  const userGuardiansList = useMemo(() => {
    if (paramUserGuardiansList) return paramUserGuardiansList;
    if (approvalType !== ApprovalType.register) {
      return storeUserGuardiansList;
    }
  }, [approvalType, paramUserGuardiansList, storeUserGuardiansList]);

  const { t } = useLanguage();
  const chainInfo = useCurrentChain('AELF');
  const { pin } = useCredentials() || {};
  const { AELF } = useCurrentWalletInfo();

  const [managerUniqueId, setManagerUniqueId] = useState<string>();
  const [guardiansStatus, setApproved] = useState<GuardiansStatus>();
  const [isExpired, setIsExpired] = useState<boolean>();

  const guardianExpiredTime = useRef<number>();
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
    setManagerUniqueId(paramManagerUniqueId || randomId());
    const listener = myEvents.setGuardianStatus.addListener(onSetGuardianStatus);
    const expiredTimer = setInterval(() => {
      if (guardianExpiredTime.current && new Date().getTime() > guardianExpiredTime.current) setIsExpired(true);
    }, 1000);
    return () => {
      listener.remove();
      expiredTimer && clearInterval(expiredTimer);
    };
  });

  const onFinish = useCallback(async () => {
    if (approvalType === ApprovalType.register) {
      navigationService.navigate('SetPin', {
        managerInfo: {
          verificationType: VerificationType.communityRecovery,
          loginGuardianType,
          type: LoginType.email,
          managerUniqueId,
        } as ManagerInfo,
        guardianCount,
      });
      return;
    }

    if (approvalType === ApprovalType.addGuardian) {
      if (!chainInfo || !pin || !AELF || !guardianItem || !editGuardianParams || !guardiansStatus || !userGuardiansList)
        return;
      const wallet = getWallet(pin);
      if (!wallet) return;

      Loading.show();
      const contract = await getELFContract({
        contractAddress: chainInfo.caContractAddress,
        rpcUrl: chainInfo.endPoint,
        account: wallet,
      });

      const guardianToAdd = {
        guardian_type: {
          type: LoginType.email,
          guardian_type: guardianItem.loginGuardianType,
        },
        verifier: {
          name: guardianItem.verifier?.name,
          signature: editGuardianParams.signature,
          verificationDoc: editGuardianParams.verifierDoc,
        },
      };

      const guardiansApproved = userGuardiansList
        .map(guardian => {
          if (!guardiansStatus[guardian.key] || !guardiansStatus[guardian.key].editGuardianParams) return null;
          return {
            guardian_type: {
              type: guardian.guardiansType,
              guardian_type: guardian.loginGuardianType,
            },
            verifier: {
              name: guardian.verifier?.name,
              signature: guardiansStatus[guardian.key].editGuardianParams?.signature,
              verificationDoc: guardiansStatus[guardian.key].editGuardianParams?.verifierDoc,
            },
          };
        })
        .filter(item => item !== null);

      console.log({
        ca_hash: AELF?.caHash,
        guardian_to_add: guardianToAdd,
        guardians_approved: guardiansApproved,
      });

      const req = await contract?.callSendMethod('AddGuardian', wallet.address, {
        ca_hash: AELF?.caHash,
        // guardianToAdd,
        // guardiansApproved,
        guardian_to_add: guardianToAdd,
        guardians_approved: guardiansApproved,
      });
      Loading.hide();
      console.log(req);
      if (req && !req.error) {
        console.log(req);
      } else {
        // CommonToast.fail(req?.error.message);
      }
    }
  }, [
    AELF,
    approvalType,
    chainInfo,
    editGuardianParams,
    guardianCount,
    guardianItem,
    guardiansStatus,
    loginGuardianType,
    managerUniqueId,
    pin,
    userGuardiansList,
  ]);

  const onBack = useCallback(() => {
    switch (approvalType) {
      case ApprovalType.addGuardian:
        navigationService.navigate('GuardianEdit');
        break;
      default:
        navigationService.goBack();
        break;
    }
  }, [approvalType]);

  return (
    <PageContainer
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.containerStyle}
      leftIconType="close"
      leftCallback={onBack}
      backTitle={approvalType === ApprovalType.register ? 'Wallet Login' : undefined}
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
                    approvalType={approvalType}
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
      {!isExpired && <CommonButton onPress={onFinish} disabled={!isSuccess} type="primary" title="Recover wallet" />}
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
