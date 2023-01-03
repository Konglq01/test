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
import { VerificationType, VerifyStatus } from '@portkey/types/verifier';
import { FontStyles } from 'assets/theme/styles';

export type GuardiansStatusItem = {
  status: VerifyStatus;
  verifierSessionId: string;
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
}

export default function GuardianAccountItem({
  guardianItem,
  isButtonHide,
  renderBtn,
  isBorderHide = false,
  managerUniqueId,
  guardiansStatus,
  setGuardianStatus,
}: GuardianAccountItemProps) {
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
      console.log(
        {
          baseURL: guardianItem.verifier?.url,
          data: {
            type: 0,
            loginGuardianType: guardianItem.loginGuardianType,
            managerUniqueId,
          },
        },
        '======',
      );

      const req = await request.recovery.sendCode({
        baseURL: guardianItem.verifier?.url,
        data: {
          type: 0,
          loginGuardianType: guardianItem.loginGuardianType,
          managerUniqueId,
        },
      });
      console.log(req, '=====req');

      if (req.verifierSessionId) {
        Loading.hide();
        await sleep(200);
        onSetGuardianStatus({
          verifierSessionId: req.verifierSessionId,
          status: VerifyStatus.Verifying,
        });
        navigationService.navigate('VerifierDetails', {
          guardianItem,
          verifierSessionId: req.verifierSessionId,
          managerUniqueId,
          loginGuardianType: guardianItem.loginGuardianType,
          verificationType: VerificationType.communityRecovery,
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
  }, [guardianItem, managerUniqueId, onSetGuardianStatus]);
  const onVerifier = useCallback(() => {
    navigationService.navigate('VerifierDetails', {
      guardianItem,
      verifierSessionId,
      loginGuardianType: guardianItem.loginGuardianType,
      managerUniqueId,
      startResend: true,
      verificationType: VerificationType.communityRecovery,
      guardianKey: guardianItem.key,
    });
  }, [guardianItem, managerUniqueId, verifierSessionId]);
  const buttonProps: CommonButtonProps = useMemo(() => {
    if (!status || status === VerifyStatus.NotVerified) {
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
  }, [onSendCode, onVerifier, status]);
  return (
    <View style={[styles.itemRow, isBorderHide && styles.itemWithoutBorder]}>
      {guardianItem.isLoginAccount && (
        <View style={styles.typeTextRow}>
          <Text style={styles.typeText}>Login Account</Text>
        </View>
      )}
      <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.flex1]}>
        <Svg icon="logo-icon" color={defaultColors.primaryColor} size={pTd(32)} />
        <Svg iconStyle={styles.iconStyle} icon="logo-icon" color={defaultColors.primaryColor} size={pTd(32)} />
        <TextM numberOfLines={1} style={[styles.nameStyle, GStyles.flex1]}>
          {guardianItem.loginGuardianType}
        </TextM>
      </View>
      {!isButtonHide && !renderBtn && (
        <CommonButton
          type="primary"
          {...buttonProps}
          titleStyle={[styles.titleStyle, fonts.mediumFont, buttonProps.titleStyle]}
          buttonStyle={[styles.buttonStyle, buttonProps.buttonStyle]}
        />
      )}
      {!isButtonHide && renderBtn && renderBtn(guardianItem)}
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
    height: 20,
    fontSize: pTd(12),
    marginTop: 4,
  },
  confirmedButtonStyle: {
    opacity: 1,
    backgroundColor: 'transparent',
  },
});
