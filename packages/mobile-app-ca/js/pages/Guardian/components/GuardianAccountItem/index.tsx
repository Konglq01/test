import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton, { CommonButtonProps } from 'components/CommonButton';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import fonts from 'assets/theme/fonts';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import Loading from 'components/Loading';
import { request } from 'api';
import CommonToast from 'components/CommonToast';
import { sleep } from '@portkey/utils';
import { ApprovalType, VerificationType, VerifyStatus } from '@portkey/types/verifier';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { isIOS } from '@rneui/base';
import { API_REQ_FUNCTION } from 'api/types';
import { EditGuardianParamsType } from '../../GuardianApproval';
import { LoginGuardianTypeIcon } from 'constants/misc';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { VerifierImage } from '../VerifierImage';

export type GuardiansStatusItem = {
  status: VerifyStatus;
  verifierSessionId: string;
  editGuardianParams?: EditGuardianParamsType;
};

export type GuardiansStatus = {
  [key: string]: GuardiansStatusItem;
};

interface GuardianAccountItemProps {
  guardianItem: UserGuardianItem;
  isButtonHide?: boolean;
  renderBtn?: (item: UserGuardianItem) => JSX.Element;
  isBorderHide?: boolean;
  managerUniqueId?: string;
  guardiansStatus?: GuardiansStatus;
  setGuardianStatus?: (key: string, status: GuardiansStatusItem) => void;
  isExpired?: boolean;
  isSuccess?: boolean;
  approvalType?: ApprovalType;
}

function GuardianItemButton({
  guardianItem,
  managerUniqueId,
  guardiansStatus,
  setGuardianStatus,
  isExpired,
  approvalType,
  disabled,
}: GuardianAccountItemProps & {
  disabled?: boolean;
}) {
  const itemStatus = useMemo(() => guardiansStatus?.[guardianItem.key], [guardianItem.key, guardiansStatus]);

  const { status, verifierSessionId } = itemStatus || {};
  const onSetGuardianStatus = useCallback(
    (guardianStatus: GuardiansStatusItem) => {
      setGuardianStatus?.(guardianItem.key, guardianStatus);
    },
    [guardianItem.key, setGuardianStatus],
  );
  const onSendCode = useCallback(async () => {
    Loading.show();
    try {
      let fetch: Record<string, API_REQ_FUNCTION> = request.recovery;
      let _verificationType = VerificationType.communityRecovery;
      if (approvalType === ApprovalType.addGuardian) {
        _verificationType = VerificationType.editGuardianApproval;
        fetch = request.verification;
      }

      const req = await fetch.sendCode({
        baseURL: guardianItem.verifier?.url,
        data: {
          type: 0,
          loginGuardianType: guardianItem.loginGuardianType,
          managerUniqueId,
        },
      });
      if (req.verifierSessionId) {
        Loading.hide();
        await sleep(200);
        onSetGuardianStatus({
          verifierSessionId: req.verifierSessionId,
          status: VerifyStatus.Verifying,
        });

        navigationService.push('VerifierDetails', {
          guardianItem,
          verifierSessionId: req.verifierSessionId,
          managerUniqueId,
          loginGuardianType: guardianItem.loginGuardianType,
          verificationType: _verificationType,
          guardianKey: guardianItem.key,
        });
      } else {
        throw new Error('send fail');
      }
    } catch (error) {
      console.log(error, '====error');

      CommonToast.failError(error);
    }
    Loading.hide();
  }, [approvalType, guardianItem, managerUniqueId, onSetGuardianStatus]);
  const onVerifier = useCallback(() => {
    let _verificationType = VerificationType.communityRecovery;
    if (approvalType === ApprovalType.addGuardian) {
      _verificationType = VerificationType.editGuardianApproval;
    }

    navigationService.navigate('VerifierDetails', {
      guardianItem,
      verifierSessionId,
      loginGuardianType: guardianItem.loginGuardianType,
      managerUniqueId,
      startResend: true,
      verificationType: _verificationType,
      guardianKey: guardianItem.key,
    });
  }, [approvalType, guardianItem, managerUniqueId, verifierSessionId]);
  const buttonProps: CommonButtonProps = useMemo(() => {
    if (!status || status === VerifyStatus.NotVerified) {
      if (isExpired)
        return {
          disabled: true,
          type: 'clear',
          title: 'Expired',
          disabledStyle: BGStyles.transparent,
          disabledTitleStyle: FontStyles.font7,
        };
      else
        return {
          onPress: onSendCode,
          title: 'Send',
        };
    } else if (status === VerifyStatus.Verifying) {
      return {
        onPress: onVerifier,
        title: 'Verify',
      };
    } else {
      return {
        title: 'Confirmed',
        type: 'clear',
        disabledTitleStyle: FontStyles.font10,
        disabledStyle: styles.confirmedButtonStyle,
        disabled: true,
      };
    }
  }, [isExpired, onSendCode, onVerifier, status]);
  return (
    <CommonButton
      type="primary"
      disabled={disabled}
      {...buttonProps}
      titleStyle={[styles.titleStyle, fonts.mediumFont, buttonProps.titleStyle]}
      buttonStyle={[styles.buttonStyle, buttonProps.buttonStyle]}
    />
  );
}

export default function GuardianAccountItem({
  guardianItem,
  isButtonHide,
  renderBtn,
  isBorderHide = false,
  managerUniqueId,
  guardiansStatus,
  setGuardianStatus,
  isExpired,
  isSuccess,
  approvalType = ApprovalType.register,
}: GuardianAccountItemProps) {
  console.log(guardianItem, '=====guardianItem');
  const itemStatus = useMemo(() => guardiansStatus?.[guardianItem.key], [guardianItem.key, guardiansStatus]);
  const disabled = isSuccess && !itemStatus;
  return (
    <View style={[styles.itemRow, isBorderHide && styles.itemWithoutBorder, disabled && styles.disabledStyle]}>
      {guardianItem.isLoginAccount && (
        <View style={styles.typeTextRow}>
          <Text style={styles.typeText}>Login Account</Text>
        </View>
      )}
      <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.flex1]}>
        <Svg icon={LoginGuardianTypeIcon[guardianItem.guardiansType as LoginType] as any} size={pTd(32)} />
        <VerifierImage size={pTd(32)} uri={guardianItem.verifier?.imageUrl} style={styles.iconStyle} />
        <TextM numberOfLines={1} style={[styles.nameStyle, GStyles.flex1]}>
          {guardianItem.loginGuardianType}
        </TextM>
      </View>
      {!isButtonHide && (
        <GuardianItemButton
          disabled={disabled}
          isExpired={isExpired}
          guardianItem={guardianItem}
          guardiansStatus={guardiansStatus}
          managerUniqueId={managerUniqueId}
          setGuardianStatus={setGuardianStatus}
          approvalType={approvalType}
        />
      )}
      {renderBtn && renderBtn(guardianItem)}
    </View>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    height: pTd(80),
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.border6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemWithoutBorder: {
    borderBottomColor: 'transparent',
  },
  typeText: {
    color: defaultColors.font6,
    fontSize: pTd(10),
    lineHeight: pTd(16),
  },
  typeTextRow: {
    left: 0,
    top: 0,
    height: pTd(16),
    position: 'absolute',
    width: 'auto',
    paddingHorizontal: pTd(6),
    backgroundColor: defaultColors.bg11,
    // borderRadius: pTd(6),
    borderTopLeftRadius: pTd(6),
    borderBottomRightRadius: pTd(6),
  },
  iconStyle: {
    marginLeft: pTd(-6),
  },
  nameStyle: {
    marginLeft: pTd(12),
  },
  buttonStyle: {
    height: 24,
  },
  titleStyle: {
    height: isIOS ? 20 : 24,
    fontSize: pTd(12),
    marginTop: 4,
  },
  confirmedButtonStyle: {
    opacity: 1,
    backgroundColor: 'transparent',
  },
  verifierStyle: {
    marginLeft: pTd(-6),
  },
  disabledStyle: {
    opacity: 0.4,
  },
});
