import { TextM, TextXXXL } from 'components/CommonText';
import PageContainer from 'components/PageContainer';
import useRouterParams from '@portkey/hooks/useRouterParams';
import { useLanguage } from 'i18n/hooks';
import React, { useMemo, useState } from 'react';
import { VERIFIER_EXPIRATION } from '@portkey/constants/misc';
import { ScrollView, StyleSheet, View } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import CommonButton from 'components/CommonButton';
import { isIphoneX } from '@portkey/utils/mobile/device';
import { BorderStyles, FontStyles } from 'assets/theme/styles';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { getApprovalCount } from '@portkey/utils/guardian';
import { VerifierItem } from '@portkey/types/verifier';
import GuardianAccountItem from '../GuardianAccountItem';

const verifierList: VerifierItem[] = [
  {
    name: 'portkey',
    imageUrl: 'PortKey',
    url: 'string',
    id: 'string',
  },
  {
    name: 'Huobi',
    imageUrl: 'Down',
    url: 'string',
    id: 'string',
  },
  {
    name: 'Binance',
    imageUrl: 'Expand',
    url: 'string',
    id: 'string',
  },
  {
    name: 'portkey1',
    imageUrl: 'PortKey',
    url: 'string',
    id: 'string',
  },
  {
    name: 'Huobi1',
    imageUrl: 'Down',
    url: 'string',
    id: 'string',
  },
  {
    name: 'Binance1',
    imageUrl: 'Expand',
    url: 'string',
    id: 'string',
  },
];

export default function GuardianApproval() {
  const { email } = useRouterParams<{ email?: string }>();
  const [approved, setApproved] = useState<VerifierItem[]>([]);
  const { t } = useLanguage();
  const approvalCount = useMemo(() => getApprovalCount(verifierList.length), []);
  return (
    <PageContainer
      scrollViewProps={{ disabled: true }}
      containerStyles={styles.containerStyle}
      leftIconType="close"
      backTitle="Wallet Login"
      type="leftBack"
      titleDom
      hideTouchable>
      <View style={GStyles.flex1}>
        <TextXXXL style={GStyles.alignCenter}>{t('Guardian approval')}</TextXXXL>
        <TextM style={[styles.expireText, GStyles.alignCenter, FontStyles.font3]}>
          Expire after {VERIFIER_EXPIRATION} hour
        </TextM>
        <View style={[styles.verifierBody, GStyles.flex1]}>
          <View style={[GStyles.itemCenter, GStyles.flexRow, BorderStyles.border6, styles.approvalTitleRow]}>
            <View style={[GStyles.itemCenter, GStyles.flexRow, styles.approvalRow]}>
              <TextM style={[FontStyles.font3, styles.approvalTitle]}>Guardian approvals</TextM>
              <Svg color={FontStyles.font3.color} size={pTd(16)} icon="question-mark" />
            </View>
            <TextM>
              <TextM style={FontStyles.font4}>{approved.length ?? 0}</TextM>/{approvalCount.toFixed(0)}
            </TextM>
          </View>
          <View style={GStyles.flex1}>
            <ScrollView>
              {[...verifierList, ...verifierList].map((item, key) => {
                return <GuardianAccountItem key={key} item={item} />;
              })}
            </ScrollView>
          </View>
        </View>
      </View>
      <CommonButton type="primary" title="Recover wallet" />
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
