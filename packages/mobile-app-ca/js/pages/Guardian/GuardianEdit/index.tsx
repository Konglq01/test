import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { TextM, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pageStyles } from './style';
import ListItem from 'components/ListItem';
import { useLanguage } from 'i18n/hooks';
import CommonInput from 'components/CommonInput';
import { checkEmail } from '@portkey/utils/check';
import { useGuardiansInfo } from 'hooks/store';
import { LOGIN_TYPE_LIST } from '@portkey/constants/verifier';
import { LoginType, VerificationType, VerifierItem } from '@portkey/types/verifier';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import GuardianTypeSelectOverlay from '../components/GuardianTypeSelectOverlay';
import VerifierSelectOverlay from '../components/VerifierSelectOverlay';
import ActionSheet from 'components/ActionSheet';
import { ErrorType } from 'types/common';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';
import { FontStyles } from 'assets/theme/styles';
import { request } from 'api';
import { randomId } from '@portkey/utils';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import useRouterParams from '@portkey/hooks/useRouterParams';

type RouterParams = {
  guardian?: UserGuardianItem;
  isEdit?: boolean;
};

const GuardianEdit: React.FC = () => {
  const { t } = useLanguage();

  const { guardian: editGuardian, isEdit = false } = useRouterParams<RouterParams>();

  const { verifierMap, userGuardiansList } = useGuardiansInfo();
  const verifierList = useMemo(() => (verifierMap ? Object.values(verifierMap) : []), [verifierMap]);

  const [selectedType, setSelectedType] = useState<typeof LOGIN_TYPE_LIST[number]>();
  const [selectedVerifier, setSelectedVerifier] = useState<VerifierItem>();
  const [email, setEmail] = useState<string>();
  const [guardianTypeError, setGuardianTypeError] = useState<ErrorType>({ ...INIT_HAS_ERROR });
  const [guardianError, setGuardianError] = useState<ErrorType>({ ...INIT_NONE_ERROR });

  useEffect(() => {
    if (editGuardian) {
      setSelectedType(LOGIN_TYPE_LIST.find(item => item.value === editGuardian?.guardiansType));
      setEmail(editGuardian?.loginGuardianType);
      setSelectedVerifier(verifierList.find(item => item.name === editGuardian?.verifier?.name));
    }
  }, [editGuardian, verifierList]);

  const onEmailTextChange = useCallback(
    (value: string) => {
      const _value = value.trim();
      if (_value === '') {
        setGuardianTypeError({ ...INIT_HAS_ERROR, errorMsg: t('Please enter Email address') });
      }
      setEmail(value);
      setGuardianTypeError({ ...INIT_NONE_ERROR });
    },
    [t],
  );

  const onSelectedVerifier = useCallback((item: VerifierItem) => {
    setGuardianError({ ...INIT_NONE_ERROR });
    setSelectedVerifier(item);
  }, []);

  const checkCurGuardianRepeat = useCallback(() => {
    if (
      userGuardiansList?.findIndex(
        guardian =>
          guardian.guardiansType === selectedType?.value &&
          guardian.loginGuardianType === email &&
          guardian.verifier?.url === selectedVerifier?.url,
      ) !== -1
    ) {
      return { ...INIT_HAS_ERROR, errorMsg: t('This guardians is already exists') };
    } else {
      return { ...INIT_NONE_ERROR };
    }
  }, [email, selectedType, selectedVerifier, t, userGuardiansList]);

  const onConfirm = useCallback(() => {
    const guardianErrorMsg = checkEmail(email);
    if (guardianErrorMsg) {
      setGuardianTypeError({
        isError: true,
        errorMsg: guardianErrorMsg,
      });
      return;
    }

    const _guardianError = checkCurGuardianRepeat();
    setGuardianError(_guardianError);
    if (_guardianError.isError) return;
    if (selectedVerifier === undefined || selectedType === undefined) return;

    ActionSheet.alert({
      title2: `Portkey will send a verification code to ${email} to verify your email address.`,
      buttons: [
        {
          title: t('Cancel'),
          type: 'outline',
        },
        {
          title: t('Confirm'),
          onPress: async () => {
            try {
              const managerUniqueId = randomId();
              Loading.show();
              const req = await request.verification.sendCode({
                baseURL: selectedVerifier.url,
                data: {
                  type: selectedType.value,
                  loginGuardianType: email,
                  managerUniqueId,
                },
              });
              if (req.verifierSessionId) {
                navigationService.navigate('VerifierDetails', {
                  loginGuardianType: email,
                  verifierSessionId: req.verifierSessionId,
                  managerUniqueId,
                  verificationType: VerificationType.addGuardian,
                  guardianItem: {
                    isLoginAccount: false,
                    verifier: selectedVerifier,
                    loginGuardianType: email,
                  },
                });
              } else {
                throw new Error('send fail');
              }
            } catch (error) {
              CommonToast.failError(error);
            }
            Loading.hide();
          },
        },
      ],
    });
  }, [checkCurGuardianRepeat, email, selectedType, selectedVerifier, t]);

  const onApproval = useCallback(() => {
    const _guardianError = checkCurGuardianRepeat();
    setGuardianError(_guardianError);
    if (_guardianError.isError) return;
    // TODO: add callback or next step
    navigationService.navigate('SelectVerifier', { loginGuardianType: email });
  }, [checkCurGuardianRepeat, email]);

  const onRemove = useCallback(() => {
    ActionSheet.alert({
      title: t('Are you sure you want to remove this guardian?'),
      message: t('Removing a guardian requires guardian approval'),
      buttons: [
        {
          title: t('No'),
          type: 'outline',
        },
        {
          title: t('Yes'),
          onPress: () => {
            // TODO: add callback or next step
            navigationService.navigate('SelectVerifier', { loginGuardianType: email });
          },
        },
      ],
    });
  }, [email, t]);

  const isConfirmDisable = useMemo(
    () => !selectedVerifier || !selectedType || !email,
    [email, selectedType, selectedVerifier],
  );

  const isApprovalDisable = useMemo(
    () => selectedVerifier?.url === editGuardian?.verifier?.url,
    [editGuardian, selectedVerifier],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={isEdit ? t('guardians') : t('Add Guardians')}
      leftCallback={() => navigationService.navigate('GuardianHome')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={pageStyles.contentWrap}>
        {!isEdit && (
          <>
            <TextM style={[pageStyles.titleLabel, GStyles.marginArg(0, 0, 8, 8)]}>{t('Guardian Type')}</TextM>
            <ListItem
              onPress={() => {
                GuardianTypeSelectOverlay.showList({
                  list: LOGIN_TYPE_LIST,
                  labelAttrName: 'name',
                  value: selectedType?.value,
                  callBack: setSelectedType,
                });
              }}
              titleStyle={[GStyles.flexRow, GStyles.itemCenter]}
              titleTextStyle={pageStyles.titleTextStyle}
              style={GStyles.marginBottom(24)}
              title={selectedType?.name || 'Select Guardians Type'}
              rightElement={<Svg size={pTd(16)} icon="down-arrow" />}
            />
          </>
        )}

        {selectedType && selectedType.value === LoginType.email && (
          <CommonInput
            disabled={isEdit}
            type="general"
            theme="white-bg"
            label="Guardian Email"
            value={email}
            placeholder={t('Enter Email')}
            maxLength={30}
            onChangeText={onEmailTextChange}
            errorMessage={guardianTypeError.isError ? guardianTypeError.errorMsg : ''}
            keyboardType="email-address"
          />
        )}

        <TextM style={[pageStyles.titleLabel, GStyles.marginArg(0, 0, 8, 8)]}>{t('Verifier')}</TextM>
        <ListItem
          onPress={() => {
            VerifierSelectOverlay.showList({
              url: selectedVerifier?.url,
              labelAttrName: 'name',
              list: verifierList,
              callBack: onSelectedVerifier,
            });
          }}
          titleLeftElement={
            selectedVerifier && (
              <Svg iconStyle={GStyles.marginRight(12)} icon="logo-icon" color={defaultColors.primaryColor} size={30} />
            )
          }
          titleStyle={[GStyles.flexRow, GStyles.itemCenter]}
          titleTextStyle={pageStyles.titleTextStyle}
          style={GStyles.marginBottom(4)}
          title={selectedVerifier?.name || 'Select Guardians Verifier'}
          rightElement={<Svg size={pTd(16)} icon="down-arrow" />}
        />
        {guardianError.isError && <TextS style={pageStyles.errorTips}>{guardianError.errorMsg || ''}</TextS>}
      </View>

      <View>
        {isEdit ? (
          <>
            <CommonButton disabled={isApprovalDisable} type="primary" onPress={onApproval}>
              {t('Guardians Approval')}
            </CommonButton>
            <CommonButton style={GStyles.marginTop(8)} type="clear" onPress={onRemove} titleStyle={FontStyles.font12}>
              {t('Remove')}
            </CommonButton>
          </>
        ) : (
          <CommonButton disabled={isConfirmDisable} type="primary" onPress={onConfirm}>
            {t('Confirm')}
          </CommonButton>
        )}
      </View>
    </PageContainer>
  );
};

export default GuardianEdit;
