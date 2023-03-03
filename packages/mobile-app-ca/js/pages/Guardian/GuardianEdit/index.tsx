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
import { checkEmail } from '@portkey-wallet/utils/check';
import { useGuardiansInfo } from 'hooks/store';
import { LOGIN_TYPE_LIST } from '@portkey-wallet/constants/verifier';
import { ApprovalType, VerificationType, VerifierItem } from '@portkey-wallet/types/verifier';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import GuardianTypeSelectOverlay from '../components/GuardianTypeSelectOverlay';
import VerifierSelectOverlay from '../components/VerifierSelectOverlay';
import ActionSheet from 'components/ActionSheet';
import { ErrorType } from 'types/common';
import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { FontStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { useAppDispatch } from 'store/hooks';
import { setPreGuardianAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { VerifierImage } from '../components/VerifierImage';
import { LoginStrType } from '@portkey-wallet/constants/constants-ca/guardian';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network-test2';
import { verification } from 'utils/api';

type RouterParams = {
  guardian?: UserGuardianItem;
  isEdit?: boolean;
};

const GuardianEdit: React.FC = () => {
  const { t } = useLanguage();
  const dispatch = useAppDispatch();

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
      setSelectedType(LOGIN_TYPE_LIST.find(item => item.value === editGuardian?.guardianType));
      setEmail(editGuardian?.guardianAccount);
      setSelectedVerifier(verifierList.find(item => item.name === editGuardian?.verifier?.name));
    }
  }, [editGuardian, verifierList]);

  const onEmailTextChange = useCallback(
    (value: string) => {
      const _value = value.trim();
      if (_value === '') {
        setGuardianTypeError({ ...INIT_HAS_ERROR, errorMsg: t(' Please enter email address') });
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
          guardian.guardianType === selectedType?.value &&
          guardian.guardianAccount === email &&
          guardian.verifier?.id === selectedVerifier?.id,
      ) !== -1
    ) {
      return { ...INIT_HAS_ERROR, errorMsg: t('This guardian already exists') };
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
      setGuardianError({ ...INIT_NONE_ERROR });
      return;
    }

    const _guardianError = checkCurGuardianRepeat();
    setGuardianError(_guardianError);
    if (_guardianError.isError) return;
    if (selectedVerifier === undefined || selectedType === undefined) return;

    ActionSheet.alert({
      title2: `${selectedVerifier.name} will send a verification code to ${email} to verify your email address.`,
      buttons: [
        {
          title: t('Cancel'),
          type: 'outline',
        },
        {
          title: t('Confirm'),
          onPress: async () => {
            try {
              Loading.show();
              const req = await verification.sendVerificationCode({
                params: {
                  type: LoginStrType[selectedType.value],
                  guardianAccount: email,
                  verifierId: selectedVerifier.id,
                  chainId: DefaultChainId,
                },
              });
              if (req.verifierSessionId) {
                navigationService.navigate('VerifierDetails', {
                  guardianItem: {
                    isLoginAccount: false,
                    verifier: selectedVerifier,
                    guardianAccount: email,
                    guardianType: LoginType.email,
                  },
                  requestCodeResult: {
                    verifierSessionId: req.verifierSessionId,
                  },
                  verificationType: VerificationType.addGuardian,
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
    if (_guardianError.isError || !editGuardian || !selectedVerifier) return;
    dispatch(setPreGuardianAction(editGuardian));

    navigationService.navigate('GuardianApproval', {
      approvalType: ApprovalType.editGuardian,
      guardianItem: {
        ...editGuardian,
        verifier: selectedVerifier,
      },
    });
  }, [checkCurGuardianRepeat, dispatch, editGuardian, selectedVerifier]);

  const onRemove = useCallback(() => {
    if (!editGuardian) return;
    if (editGuardian.isLoginAccount) {
      ActionSheet.alert({
        title2: t(`This guardian is login account and cannot be remove`),
        buttons: [
          {
            title: t('OK'),
          },
        ],
      });
      return;
    }

    ActionSheet.alert({
      title: t('Are you sure you want to remove this guardian?'),
      message: t(`Removing a guardian requires guardians' approval`),
      buttons: [
        {
          title: t('Close'),
          type: 'outline',
        },
        {
          title: t('Send Request'),
          onPress: () => {
            navigationService.navigate('GuardianApproval', {
              approvalType: ApprovalType.deleteGuardian,
              guardianItem: editGuardian,
            });
          },
        },
      ],
    });
  }, [editGuardian, t]);

  const isConfirmDisable = useMemo(
    () => !selectedVerifier || !selectedType || !email,
    [email, selectedType, selectedVerifier],
  );

  const isApprovalDisable = useMemo(
    () => selectedVerifier?.id === editGuardian?.verifier?.id,
    [editGuardian, selectedVerifier],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'gray']}
      titleDom={isEdit ? t('Edit Guardians') : t('Add Guardians')}
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
              title={selectedType?.name || t('Select guardian types')}
              rightElement={<Svg size={pTd(16)} icon="down-arrow" />}
            />
          </>
        )}

        {selectedType && selectedType.value === LoginType.email && (
          <CommonInput
            disabled={isEdit}
            type="general"
            theme="white-bg"
            label={t("Guardian's email")}
            value={email}
            placeholder={t('Enter email')}
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
              id: selectedVerifier?.id,
              labelAttrName: 'name',
              list: verifierList,
              callBack: onSelectedVerifier,
            });
          }}
          titleLeftElement={
            selectedVerifier && (
              <VerifierImage style={GStyles.marginRight(12)} size={pTd(30)} uri={selectedVerifier.imageUrl} />
            )
          }
          titleStyle={[GStyles.flexRow, GStyles.itemCenter]}
          titleTextStyle={pageStyles.titleTextStyle}
          style={GStyles.marginBottom(4)}
          title={selectedVerifier?.name || t('Select guardian verifiers')}
          rightElement={<Svg size={pTd(16)} icon="down-arrow" />}
        />
        {guardianError.isError && <TextS style={pageStyles.errorTips}>{guardianError.errorMsg || ''}</TextS>}
      </View>

      <View>
        {isEdit ? (
          <>
            <CommonButton disabled={isApprovalDisable} type="primary" onPress={onApproval}>
              {t('Send Request')}
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
