import { TextM, TextXXXL } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { useLanguage } from 'i18n/hooks';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GUARDIAN_EXPIRED_TIME, VERIFIER_EXPIRATION } from '@portkey/constants/misc';
import { ScrollView, StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { BorderStyles, FontStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { getApprovalCount } from '@portkey/utils/guardian';
import { ApprovalType, VerificationType, VerifierInfo, VerifyStatus } from '@portkey/types/verifier';
import GuardianItem from '../components/GuardianItem';
import useEffectOnce from 'hooks/useEffectOnce';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import navigationService from 'utils/navigationService';
import { LoginType, ManagerInfo } from '@portkey/types/types-ca/wallet';
import Touchable from 'components/Touchable';
import ActionSheet from 'components/ActionSheet';
import myEvents from 'utils/deviceEvent';
import Loading from 'components/Loading';
import { useGuardiansInfo } from 'hooks/store';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import CommonToast from 'components/CommonToast';
import { useAppDispatch } from 'store/hooks';
import { setPreGuardianAction } from '@portkey/store/store-ca/guardians/actions';
import { addGuardian, deleteGuardian, editGuardian } from 'utils/guardian';
import { useGetCurrentCAContract } from 'hooks/contract';
import { GuardiansStatus, GuardiansStatusItem } from '../types';
import { handleGuardiansApproved } from 'utils/login';

type RouterParams = {
  loginAccount?: string;
  userGuardiansList?: UserGuardianItem[];
  approvalType: ApprovalType;
  guardianItem?: UserGuardianItem;
  verifierInfo?: VerifierInfo;
  verifiedTime?: number;
};
export default function GuardianApproval() {
  const {
    loginAccount,
    userGuardiansList: paramUserGuardiansList,
    approvalType = ApprovalType.register,
    guardianItem,
    verifierInfo,
    verifiedTime,
  } = useRouterParams<RouterParams>();
  const dispatch = useAppDispatch();

  const { userGuardiansList: storeUserGuardiansList, preGuardian } = useGuardiansInfo();

  const userGuardiansList = useMemo(() => {
    if (paramUserGuardiansList) return paramUserGuardiansList;
    if (approvalType === ApprovalType.deleteGuardian || approvalType === ApprovalType.editGuardian) {
      return storeUserGuardiansList?.filter(item => item.key !== guardianItem?.key);
    }
    return storeUserGuardiansList;
  }, [approvalType, guardianItem?.key, paramUserGuardiansList, storeUserGuardiansList]);

  const { t } = useLanguage();
  const { caHash, address: managerAddress } = useCurrentWalletInfo();
  const getCurrentCAContract = useGetCurrentCAContract();

  const [guardiansStatus, setApproved] = useState<GuardiansStatus>();
  const [isExpired, setIsExpired] = useState<boolean>();
  console.log(guardiansStatus, '==guardiansStatus');

  const guardianExpiredTime = useRef<number>();
  const approvedList = useMemo(() => {
    return Object.values(guardiansStatus || {}).filter(guardian => guardian.status === VerifyStatus.Verified);
  }, [guardiansStatus]);

  const isGuardianOpt = useMemo(
    () =>
      approvalType === ApprovalType.addGuardian ||
      approvalType === ApprovalType.deleteGuardian ||
      approvalType === ApprovalType.editGuardian,
    [approvalType],
  );

  const setGuardianStatus = useCallback((key: string, status: GuardiansStatusItem) => {
    if (key === 'resetGuardianApproval') {
      setApproved(undefined);
      guardianExpiredTime.current = undefined;
    } else {
      setApproved(preGuardiansStatus => ({ ...preGuardiansStatus, [key]: status }));
    }
  }, []);

  const guardianCount = useMemo(() => getApprovalCount(userGuardiansList?.length || 0), [userGuardiansList?.length]);
  const isSuccess = useMemo(() => guardianCount <= approvedList.length, [guardianCount, approvedList.length]);
  const onSetGuardianStatus = useCallback(
    (data: { key: string; status: GuardiansStatusItem }) => {
      setGuardianStatus(data.key, data.status);
      if (!guardianExpiredTime.current && data.status?.status === VerifyStatus.Verified)
        guardianExpiredTime.current = new Date().getTime() + GUARDIAN_EXPIRED_TIME;
    },
    [setGuardianStatus],
  );
  useEffectOnce(() => {
    const listener = myEvents.setGuardianStatus.addListener(onSetGuardianStatus);
    const expiredTimer = setInterval(() => {
      if (guardianExpiredTime.current && new Date().getTime() > guardianExpiredTime.current) setIsExpired(true);
    }, 1000);
    if (verifiedTime) guardianExpiredTime.current = verifiedTime + GUARDIAN_EXPIRED_TIME;
    return () => {
      listener.remove();
      expiredTimer && clearInterval(expiredTimer);
    };
  });

  const onBack = useCallback(() => {
    if (approvalType === ApprovalType.addGuardian) {
      navigationService.navigate('GuardianEdit');
    } else {
      navigationService.goBack();
    }
  }, [approvalType]);

  const registerAccount = useCallback(() => {
    navigationService.navigate('SetPin', {
      managerInfo: {
        verificationType: VerificationType.communityRecovery,
        loginAccount,
        type: LoginType.email,
      } as ManagerInfo,
      guardiansApproved: handleGuardiansApproved(
        guardiansStatus as GuardiansStatus,
        userGuardiansList as UserGuardianItem[],
      ),
    });
  }, [guardiansStatus, loginAccount, userGuardiansList]);

  const onAddGuardian = useCallback(async () => {
    if (!managerAddress || !caHash || !verifierInfo || !guardianItem || !guardiansStatus || !userGuardiansList) return;
    Loading.show();
    try {
      const caContract = await getCurrentCAContract();
      const req = await addGuardian(
        caContract,
        managerAddress,
        caHash,
        verifierInfo,
        guardianItem,
        userGuardiansList,
        guardiansStatus,
      );
      if (req && !req.error) {
        CommonToast.success('Guardians Added');
        myEvents.refreshGuardiansList.emit();
        navigationService.navigate('GuardianHome');
      } else {
        CommonToast.fail(req?.error.message);
      }
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [caHash, getCurrentCAContract, guardianItem, guardiansStatus, managerAddress, userGuardiansList, verifierInfo]);

  const onDeleteGuardian = useCallback(async () => {
    if (!managerAddress || !caHash || !guardianItem || !userGuardiansList || !guardiansStatus) return;
    Loading.show();
    try {
      const caContract = await getCurrentCAContract();
      const req = await deleteGuardian(
        caContract,
        managerAddress,
        caHash,
        guardianItem,
        userGuardiansList,
        guardiansStatus,
      );
      if (req && !req.error) {
        myEvents.refreshGuardiansList.emit();
        navigationService.navigate('GuardianHome');
      } else {
        CommonToast.fail(req?.error.message);
      }
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [caHash, getCurrentCAContract, guardianItem, guardiansStatus, managerAddress, userGuardiansList]);

  const onEditGuardian = useCallback(async () => {
    if (!managerAddress || !caHash || !preGuardian || !guardianItem || !userGuardiansList || !guardiansStatus) return;
    Loading.show();
    try {
      const caContract = await getCurrentCAContract();
      const req = await editGuardian(
        caContract,
        managerAddress,
        caHash,
        preGuardian,
        guardianItem,
        userGuardiansList,
        guardiansStatus,
      );
      if (req && !req.error) {
        dispatch(setPreGuardianAction(undefined));
        myEvents.refreshGuardiansList.emit();
        navigationService.navigate('GuardianHome');
      } else {
        CommonToast.fail(req?.error.message);
      }
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [
    caHash,
    dispatch,
    getCurrentCAContract,
    guardianItem,
    guardiansStatus,
    managerAddress,
    preGuardian,
    userGuardiansList,
  ]);

  const onFinish = useCallback(async () => {
    switch (approvalType) {
      case ApprovalType.register:
        registerAccount();
        break;
      case ApprovalType.addGuardian:
        onAddGuardian();
        break;
      case ApprovalType.deleteGuardian:
        onDeleteGuardian();
        break;
      case ApprovalType.editGuardian:
        onEditGuardian();
        break;
      default:
        break;
    }
  }, [onAddGuardian, approvalType, onDeleteGuardian, onEditGuardian, registerAccount]);

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
          {isExpired ? 'Expired' : `Expire after ${VERIFIER_EXPIRATION} hour`}
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
              <TextM style={FontStyles.font4}>{approvedList.length ?? 0}</TextM>/{guardianCount}
            </TextM>
          </View>
          <View style={GStyles.flex1}>
            <ScrollView>
              {userGuardiansList?.map(item => {
                return (
                  <GuardianItem
                    key={item.key}
                    guardianItem={item}
                    setGuardianStatus={setGuardianStatus}
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
      {!isExpired && (
        <CommonButton
          onPress={onFinish}
          disabled={!isSuccess}
          type="primary"
          title={isGuardianOpt ? 'Confirm' : 'Recover wallet'}
        />
      )}
    </PageContainer>
  );
}
const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: 8,
    paddingBottom: 16,
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
