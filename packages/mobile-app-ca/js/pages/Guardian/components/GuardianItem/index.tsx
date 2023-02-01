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
import { LoginGuardianTypeIcon } from 'constants/misc';
import { LoginType } from '@portkey/types/types-ca/wallet';
import { VerifierImage } from '../VerifierImage';
import { LoginStrType } from '@portkey/constants/constants-ca/guardian';
import { GuardiansStatus, GuardiansStatusItem } from 'pages/Guardian/types';

interface GuardianAccountItemProps {
  guardianItem: UserGuardianItem;
  isButtonHide?: boolean;
  renderBtn?: (item: UserGuardianItem) => JSX.Element;
  isBorderHide?: boolean;
  guardiansStatus?: GuardiansStatus;
  setGuardianStatus?: (key: string, status: GuardiansStatusItem) => void;
  isExpired?: boolean;
  isSuccess?: boolean;
  approvalType?: ApprovalType;
}

function GuardianItemButton({
  guardianItem,
  guardiansStatus,
  setGuardianStatus,
  isExpired,
  approvalType,
  disabled,
}: GuardianAccountItemProps & {
  disabled?: boolean;
}) {
  const itemStatus = useMemo(() => guardiansStatus?.[guardianItem.key], [guardianItem.key, guardiansStatus]);

  const { status, verifierResult } = itemStatus || {};

  const verifierInfo = useMemo(() => {
    let _verificationType = VerificationType.communityRecovery;
    if (
      approvalType === ApprovalType.addGuardian ||
      approvalType === ApprovalType.deleteGuardian ||
      approvalType === ApprovalType.editGuardian
    ) {
      _verificationType = VerificationType.editGuardianApproval;
    }
    return {
      guardianItem,
      guardianAccount: guardianItem.guardianAccount,
      type: guardianItem.guardianType,
      verificationType: _verificationType,
    };
  }, [approvalType, guardianItem]);

  const onSetGuardianStatus = useCallback(
    (guardianStatus: GuardiansStatusItem) => {
      setGuardianStatus?.(guardianItem.key, guardianStatus);
    },
    [guardianItem.key, setGuardianStatus],
  );
  const onSendCode = useCallback(async () => {
    Loading.show();
    try {
      const req = await request.verify.sendCode({
        data: {
          type: LoginStrType[verifierInfo.type],
          guardianAccount: verifierInfo.guardianAccount,
          verifierId: verifierInfo.guardianItem.verifier?.id,
        },
      });
      if (req.verifierSessionId) {
        Loading.hide();
        await sleep(200);
        onSetGuardianStatus({
          verifierResult: req,
          status: VerifyStatus.Verifying,
        });
        navigationService.push('VerifierDetails', {
          ...verifierInfo,
          verifierResult: req,
        });
      } else {
        throw new Error('send fail');
      }
    } catch (error) {
      console.log(error, '====error');

      CommonToast.failError(error);
    }
    Loading.hide();
  }, [onSetGuardianStatus, verifierInfo]);
  const onVerifier = useCallback(() => {
    navigationService.push('VerifierDetails', {
      ...verifierInfo,
      verifierResult,
      startResend: true,
    });
  }, [verifierInfo, verifierResult]);
  const buttonProps: CommonButtonProps = useMemo(() => {
    if (isExpired && status !== VerifyStatus.Verified) {
      return {
        disabled: true,
        type: 'clear',
        title: 'Expired',
        disabledStyle: BGStyles.transparent,
        disabledTitleStyle: FontStyles.font7,
      };
    }
    if (!status || status === VerifyStatus.NotVerified) {
      return {
        onPress: onSendCode,
        title: 'Send',
      };
    }
    if (status === VerifyStatus.Verifying) {
      return {
        onPress: onVerifier,
        title: 'Verify',
      };
    }
    return {
      title: 'Confirmed',
      type: 'clear',
      disabledTitleStyle: FontStyles.font10,
      disabledStyle: styles.confirmedButtonStyle,
      disabled: true,
    };
  }, [isExpired, onSendCode, onVerifier, status]);
  return (
    <CommonButton
      type="primary"
      disabled={disabled}
      disabledTitleStyle={styles.disabledTitleStyle}
      disabledStyle={styles.disabledItemStyle}
      {...buttonProps}
      titleStyle={[styles.titleStyle, fonts.mediumFont, buttonProps.titleStyle]}
      buttonStyle={[styles.buttonStyle, buttonProps.buttonStyle]}
    />
  );
}

export default function GuardianItem({
  guardianItem,
  isButtonHide,
  renderBtn,
  isBorderHide = false,
  guardiansStatus,
  setGuardianStatus,
  isExpired,
  isSuccess,
  approvalType = ApprovalType.register,
}: GuardianAccountItemProps) {
  console.log(guardianItem, '=====guardianItem');
  const itemStatus = useMemo(() => guardiansStatus?.[guardianItem.key], [guardianItem.key, guardiansStatus]);
  const disabled = isSuccess && itemStatus?.status !== VerifyStatus.Verified;
  return (
    <View style={[styles.itemRow, isBorderHide && styles.itemWithoutBorder, disabled && styles.disabledStyle]}>
      {guardianItem.isLoginAccount && (
        <View style={styles.typeTextRow}>
          <Text style={styles.typeText}>Login Account</Text>
        </View>
      )}
      <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.flex1]}>
        <Svg icon={LoginGuardianTypeIcon[guardianItem.guardianType as LoginType] as any} size={pTd(32)} />
        <VerifierImage size={pTd(32)} uri={guardianItem.verifier?.imageUrl} style={styles.iconStyle} />
        <TextM numberOfLines={1} style={[styles.nameStyle, GStyles.flex1]}>
          {guardianItem.guardianAccount}
        </TextM>
      </View>
      {!isButtonHide && (
        <GuardianItemButton
          disabled={disabled}
          isExpired={isExpired}
          guardianItem={guardianItem}
          guardiansStatus={guardiansStatus}
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
  disabledTitleStyle: {
    opacity: 1,
  },
  disabledItemStyle: {
    opacity: 1,
  },
});
