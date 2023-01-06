import React from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { TextM, TextXL } from 'components/CommonText';
import { pTd } from 'utils/unit';
import { ModalBody } from 'components/ModalBody';
import { useLanguage } from 'i18n/hooks';
import { FontStyles } from 'assets/theme/styles';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';

type ExistOverlayProps = {
  callBack: (isConfirm: boolean) => void;
};

const ExistOverlay = ({ callBack }: ExistOverlayProps) => {
  const { t } = useLanguage();
  return (
    <ModalBody modalBodyType="center" style={styles.modalStyle}>
      <TextXL style={styles.title}>{t('Are you sure you want to exit your wallet?')}</TextXL>
      <TextM style={[FontStyles.font3, styles.label]}>
        {t('Your current wallet and assets will be removed from this app permanently. This action cannot be undone.')}
      </TextM>
      <TextM style={[FontStyles.font3, styles.label]}>
        {t('You can ONLY recover this wallet with the help of your guardians.')}
      </TextM>

      <CommonButton
        type="solid"
        containerStyle={[styles.btnContainer, GStyles.marginTop(20)]}
        buttonStyle={[styles.btnStyle, styles.confirmBtnStyle]}
        titleStyle={[FontStyles.font2, styles.btnTitle]}
        onPress={() => {
          OverlayModal.hide();
          callBack(true);
        }}>
        {t('I Understand, Confirm Exit')}
      </CommonButton>
      <CommonButton
        type="outline"
        containerStyle={styles.btnContainer}
        buttonStyle={[styles.btnStyle, styles.cancelButtonStyle]}
        titleStyle={[FontStyles.font5, styles.btnTitle]}
        onPress={() => {
          OverlayModal.hide();
          callBack(false);
        }}>
        {t('Cancel')}
      </CommonButton>
    </ModalBody>
  );
};

const showExistOverlay = (params: ExistOverlayProps) => {
  OverlayModal.show(<ExistOverlay {...params} />, { position: 'center' });
};

export default {
  showExistOverlay,
};

export const styles = StyleSheet.create({
  modalStyle: {
    width: pTd(327),
    padding: pTd(24),
  },
  title: {
    textAlign: 'center',
    lineHeight: pTd(22),
    marginBottom: pTd(24),
  },
  label: {
    textAlign: 'center',
    marginBottom: pTd(12),
    lineHeight: pTd(20),
  },
  btnContainer: {
    marginTop: pTd(12),
  },
  btnStyle: {
    width: pTd(279),
    height: pTd(40),
  },
  confirmBtnStyle: {
    backgroundColor: defaultColors.error,
    borderColor: defaultColors.error,
  },
  cancelButtonStyle: {
    borderColor: defaultColors.border1,
  },
  btnTitle: {
    fontSize: pTd(14),
    lineHeight: pTd(20),
  },
});
