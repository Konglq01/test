import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { TextM } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import fonts from 'assets/theme/fonts';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { useGuardiansInfo } from 'hooks/store';
import Loading from 'components/Loading';
import { request } from 'api';
import CommonToast from 'components/CommonToast';
import { sleep } from '@portkey/utils';
import { useAppDispatch } from 'store/hooks';
import { setUserGuardianItemStatus } from '@portkey/store/store-ca/guardians/actions';
import { VerifyStatus } from '@portkey/types/verifier';

interface GuardianAccountItemProps {
  item: UserGuardianItem;
  isButtonHide?: boolean;
  renderBtn?: (item: UserGuardianItem) => JSX.Element;
  isBorderHide?: boolean;
  managerUniqueId: string;
}

export default function GuardianAccountItem({
  item,
  isButtonHide,
  renderBtn,
  isBorderHide = false,
  managerUniqueId,
}: GuardianAccountItemProps) {
  const dispatch = useAppDispatch();
  const { userGuardianStatus } = useGuardiansInfo();
  const itemStatus = useMemo(() => userGuardianStatus?.[item.key], [item.key, userGuardianStatus]);
  console.log(itemStatus, '====itemStatus');
  const onVerifierSuccess = useCallback(() => {
    dispatch(
      setUserGuardianItemStatus({
        key: item.key,
        status: VerifyStatus.Verified,
      }),
    );
  }, [dispatch, item.key]);
  return (
    <View style={[styles.itemRow, isBorderHide && styles.itemWithoutBorder]}>
      {item.isLoginAccount && (
        <View style={styles.typeTextRow}>
          <Text style={styles.typeText}>Login Account</Text>
        </View>
      )}
      <View style={[GStyles.flexRow, GStyles.itemCenter, GStyles.flex1]}>
        <Svg icon="logo-icon" color={defaultColors.primaryColor} size={pTd(32)} />
        <Svg iconStyle={styles.iconStyle} icon="logo-icon" color={defaultColors.primaryColor} size={pTd(32)} />
        <TextM numberOfLines={1} style={[styles.nameStyle, GStyles.flex1]}>
          {item.loginGuardianType}
        </TextM>
      </View>
      {!isButtonHide &&
        (!itemStatus ? (
          <CommonButton
            onPress={async () => {
              Loading.show();
              try {
                const req = await request.recovery.sendCode({
                  baseURL: item.verifier?.url,
                  data: {
                    type: 0,
                    loginGuardianType: item.loginGuardianType,
                    managerUniqueId,
                  },
                });
                console.log(req, '=====req');

                if (req.verifierSessionId) {
                  Loading.hide();
                  await sleep(200);
                  dispatch(
                    setUserGuardianItemStatus({
                      key: item.key,
                      status: VerifyStatus.Verifying,
                    }),
                  );
                  navigationService.navigate('VerifierDetails', {
                    loginGuardianType: item.loginGuardianType,
                    verifierSessionId: req.verifierSessionId,
                    managerUniqueId,
                    onVerifierSuccess,
                  });
                } else {
                  throw new Error('send fail');
                }
              } catch (error) {
                CommonToast.failError(error);
              }
              Loading.hide();
            }}
            titleStyle={[styles.titleStyle, fonts.mediumFont]}
            buttonStyle={styles.buttonStyle}
            type="primary"
            title="Send"
          />
        ) : null)}
      {renderBtn && renderBtn(item)}
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
    height: 24,
    fontSize: pTd(12),
    marginTop: 4,
  },
});
