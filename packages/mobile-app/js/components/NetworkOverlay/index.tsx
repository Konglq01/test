import React, { ReactNode } from 'react';
import OverlayModal from 'components/OverlayModal';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextL, TextM, TextS, TextTitle } from 'components/CommonText';
import GStyles from 'assets/theme/GStyles';
import { useAppDispatch } from 'store/hooks';
import { pTd } from 'utils/unit';
import { ChainItemType } from '@portkey-wallet/types/chain';
import { addCommonList } from '@portkey-wallet/store/network/actions';
import { screenHeight, screenWidth } from 'utils/device';
import Svg from 'components/Svg';
import ActionSheet from 'components/ActionSheet';
import { defaultColors } from 'assets/theme';
import ButtonRow, { ButtonRowProps } from 'components/ButtonRow';
import i18n from 'i18n';

function ListRow({ title, detail }: { title: string; detail: ReactNode }) {
  return (
    <>
      <TextS style={styles.listRowTitle}>{title}</TextS>
      <TextL style={styles.listRowDetail}>{detail}</TextL>
    </>
  );
}

const SwitchChainInfo = ({ chain }: { chain: ChainItemType }) => {
  const dispatch = useAppDispatch();
  return (
    <View style={styles.bottomBox}>
      <TextTitle style={GStyles.alignCenter}>Want to add this network?</TextTitle>
      <View style={[styles.switchRow, GStyles.alignCenter, GStyles.marginTop(16)]}>
        <Svg icon="aelf-avatar" size={pTd(24)} />
        <TextM numberOfLines={1} style={[styles.tipNetworkNameStyle, styles.infoNetworkNameStyle]}>
          {chain.networkName}
        </TextM>
      </View>
      <ScrollView style={styles.chainInfoBody}>
        <ListRow title="網絡系列" detail={chain.chainType} />
        <ListRow title="網絡名稱" detail={chain.networkName} />
        <ListRow title="節點連接RPC" detail={chain.rpcUrl} />
        <ListRow title="鏈ID" detail={chain.chainId} />
        {chain.blockExplorerURL ? <ListRow title="Block Explorer URL" detail={chain.blockExplorerURL} /> : null}
      </ScrollView>
      <ButtonRow
        style={styles.buttonRowStyle}
        buttonStyle={styles.buttonStyle}
        buttons={[
          { title: 'Cancel', type: 'outline', onPress: () => OverlayModal.hide() },
          {
            title: 'Approve',
            onPress: () => {
              OverlayModal.hide();
              dispatch(addCommonList(chain));
            },
          },
        ]}
      />
    </View>
  );
};

const showAddChainInfo = (chain: ChainItemType) => {
  OverlayModal.show(<SwitchChainInfo chain={chain} />, {
    position: 'bottom',
  });
};

const showSwitchChain = (chain: ChainItemType, buttons?: ButtonRowProps['buttons']) => {
  ActionSheet.alert({
    title: i18n.t('Switch to This Network?'),
    message: (
      <View style={styles.switchRow}>
        <Svg icon="aelf-avatar" size={pTd(24)} />
        <TextM numberOfLines={1} style={styles.tipNetworkNameStyle}>
          {chain.networkName}
        </TextM>
      </View>
    ),
    message2: chain.rpcUrl,
    buttons,
  });
};

export default {
  showAddChainInfo,
  showSwitchChain,
};

const styles = StyleSheet.create({
  // bottom
  bottomBox: {
    overflow: 'hidden',
    backgroundColor: 'white',
    maxHeight: screenHeight * 0.7,
    paddingVertical: 15,
  },
  switchRow: {
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pTd(16),
    backgroundColor: defaultColors.bg6,
    borderWidth: 0.5,
    borderColor: defaultColors.border1,
    marginVertical: 5,
    marginBottom: 8,
  },
  tipNetworkNameStyle: {
    marginLeft: pTd(8),
    color: defaultColors.font3,
    maxWidth: screenWidth * 0.4,
  },
  buttonStyle: {
    height: 48,
  },
  infoNetworkNameStyle: {
    maxWidth: screenWidth * 0.5,
  },
  chainInfoBody: {
    borderTopWidth: 1,
    borderTopColor: defaultColors.border6,
    paddingHorizontal: pTd(24),
    paddingTop: 25,
    marginTop: 16,
  },
  buttonRowStyle: {
    paddingHorizontal: pTd(16),
    marginTop: 8,
  },
  listRowTitle: { color: defaultColors.font3 },
  listRowDetail: {
    marginTop: 6,
    marginBottom: 24,
  },
});
