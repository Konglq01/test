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
import GuardianAccountItem, { GuardiansStatus, GuardiansStatusItem } from '../components/GuardianAccountItem';
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
import CommonToast from 'components/CommonToast';

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

  const isExcludeCurrent = useMemo(
    () => approvalType === ApprovalType.deleteGuardian || approvalType === ApprovalType.editGuardian,
    [approvalType],
  );

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

  const guardianCount = useMemo(
    () => getApprovalCount((isExcludeCurrent ? (userGuardiansList?.length || 1) - 1 : userGuardiansList?.length) || 0),
    [isExcludeCurrent, userGuardiansList?.length],
  );
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

  const registerAccount = useCallback(() => {
    navigationService.navigate('SetPin', {
      managerInfo: {
        verificationType: VerificationType.communityRecovery,
        loginGuardianType,
        type: LoginType.email,
        managerUniqueId,
      } as ManagerInfo,
      guardianCount,
    });
  }, [guardianCount, loginGuardianType, managerUniqueId]);

  const addGuardian = useCallback(async () => {
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
      guardianType: {
        type: LoginType.email,
        guardianType: guardianItem.loginGuardianType,
      },
      verifier: {
        name: guardianItem.verifier?.name,
        signature: Buffer.from(editGuardianParams.signature as any, 'base64').toString('hex'),
        verificationDoc: editGuardianParams.verifierDoc,
      },
    };

    const guardiansApproved = userGuardiansList
      .map(guardian => {
        if (!guardiansStatus[guardian.key] || !guardiansStatus[guardian.key].editGuardianParams) return null;
        return {
          guardianType: {
            type: guardian.guardiansType,
            guardianType: guardian.loginGuardianType,
          },
          verifier: {
            name: guardian.verifier?.name,
            signature: Buffer.from(
              guardiansStatus[guardian.key].editGuardianParams?.signature as any,
              'base64',
            ).toString('hex'),
            verificationDoc: guardiansStatus[guardian.key].editGuardianParams?.verifierDoc,
          },
        };
      })
      .filter(item => item !== null);

    console.log({
      caHash: AELF?.caHash,
      guardianToAdd: guardianToAdd,
      guardiansApproved: guardiansApproved,
    });
    console.log(wallet.privateKey);
    console.log(chainInfo.caContractAddress);

    const req = await contract?.callSendMethod('AddGuardian', wallet.address, {
      caHash: AELF?.caHash,
      guardianToAdd: guardianToAdd,
      guardiansApproved: guardiansApproved,
    });
    Loading.hide();
    console.log(req);
    if (req && !req.error) {
      console.log(req);
    } else {
      CommonToast.failError(req?.error?.message?.Message);
    }
  }, [AELF, chainInfo, editGuardianParams, guardianItem, guardiansStatus, pin, userGuardiansList]);

  const deleteGuardian = useCallback(() => {
    //
  }, []);

  const editGuardian = useCallback(() => {
    //
  }, []);

  const onFinish = useCallback(async () => {
    if (approvalType === ApprovalType.register) {
      registerAccount();
      return;
    }

    if (approvalType === ApprovalType.addGuardian) {
      addGuardian();
      return;
    }

    if (approvalType === ApprovalType.deleteGuardian) {
      deleteGuardian();
      return;
    }

    if (approvalType === ApprovalType.editGuardian) {
      editGuardian();
      return;
    }
  }, [addGuardian, approvalType, deleteGuardian, editGuardian, registerAccount]);

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
              {isExcludeCurrent
                ? userGuardiansList
                    ?.filter(item => item.key !== guardianItem?.key)
                    .map(item => {
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
                    })
                : userGuardiansList?.map(item => {
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
