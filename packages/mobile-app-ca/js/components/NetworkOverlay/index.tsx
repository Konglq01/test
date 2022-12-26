import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { TextL, TextXL } from 'components/CommonText';
import OverlayModal from 'components/OverlayModal';
import OverlayBody from 'components/OverlayModal/OverlayBody';
import { useCurrentNetworkInfo, useNetworkList } from '@portkey/hooks/hooks-ca/network';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { NetworkItem } from '@portkey/constants/constants-ca/network';
import { BorderStyles } from 'assets/theme/styles';
import { useChangeNetwork } from 'hooks/network';
import { ParamListBase, RouteProp } from '@react-navigation/native';

const showSwitchChain = () => {
  console.log('');
};

function Network({
  network,
  hideBorder,
  route,
}: {
  network: NetworkItem;
  hideBorder?: boolean;
  route: RouteProp<ParamListBase>;
}) {
  const currentNetworkInfo = useCurrentNetworkInfo();
  const changeNetwork = useChangeNetwork(route);
  return (
    <Touchable
      disabled={!network.isActive}
      onPress={() => {
        changeNetwork(network);
        OverlayModal.hide();
      }}
      style={[styles.itemRow, !network.isActive ? styles.disableItem : undefined]}
      key={network.name}>
      <Svg size={40} icon="aelf-avatar" />
      <View style={[styles.nameRow, BorderStyles.border4, !hideBorder ? styles.borderBottom1 : undefined]}>
        <TextL numberOfLines={1} style={styles.nameText}>
          {network.name}
        </TextL>
      </View>
      {currentNetworkInfo.name === network.name && <Svg iconStyle={styles.selectIconStyle} icon="selected" size={21} />}
    </Touchable>
  );
}

function SwitchNetwork({ route }: { route: RouteProp<ParamListBase> }) {
  const networkList = useNetworkList();
  return (
    <OverlayBody>
      <TextXL style={styles.title}>Switch Network</TextXL>
      {networkList.map((network, index) => (
        <Network route={route} hideBorder={index === networkList.length - 1} network={network} key={network.name} />
      ))}
    </OverlayBody>
  );
}

const showSwitchNetwork = (route: RouteProp<ParamListBase>) => {
  Keyboard.dismiss();
  OverlayModal.show(<SwitchNetwork route={route} />, {
    position: 'bottom',
  });
};

export default {
  showSwitchChain,
  showSwitchNetwork,
};

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  itemRow: {
    height: 72,
    paddingLeft: pTd(20),
    alignItems: 'center',
    flexDirection: 'row',
  },
  disableItem: {
    opacity: 0.3,
  },
  nameRow: {
    flex: 1,
    marginLeft: pTd(12),
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  borderBottom1: {
    borderBottomWidth: 1,
  },
  nameText: {
    flex: 1,
    marginRight: 50,
  },
  selectIconStyle: {
    position: 'absolute',
    right: pTd(22),
  },
});
