import { useCurrentNetwork } from '@portkey-wallet/hooks/network';
import { addCommonList, removeCommonList, setCurrentChain } from '@portkey-wallet/store/network/actions';
import { ChainItemType } from '@portkey-wallet/types/chain';
import { defaultColors } from 'assets/theme';
import CommonSwitch from 'components/CommonSwitch';
import { TextL } from 'components/CommonText';
import NetworkOverlay from 'components/NetworkOverlay';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import i18n from 'i18n';
import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppDispatch } from 'store/hooks';
import navigationService from 'utils/navigationService';
import { pTd } from 'utils/unit';

function NetworkItem({ chain }: { chain: ChainItemType; isCommon?: boolean; isAll?: boolean; isCustom?: boolean }) {
  const dispatch = useAppDispatch();
  const currentNetwork = useCurrentNetwork();
  const leftElement = useMemo(() => {
    const selected = currentNetwork.key === chain.key;
    return (
      <Touchable
        disabled={selected}
        style={styles.logoRow}
        onPress={() =>
          NetworkOverlay.showSwitchChain(chain, [
            { title: i18n.t('Not Now'), type: 'outline' },
            {
              title: i18n.t('Yes2'),
              onPress: () => dispatch(setCurrentChain(chain)),
            },
          ])
        }>
        {selected && <Svg size={pTd(20)} icon="selected2" iconStyle={styles.selectedStyle} />}
        <Svg icon="aelf-avatar" size={pTd(48)} />
      </Touchable>
    );
  }, [chain, currentNetwork.key, dispatch]);
  const rightElement = useMemo(() => {
    if (chain.isFixed) return <Svg size={pTd(17.5)} iconStyle={styles.lockStyle} icon="lock" />;
    return (
      <CommonSwitch
        value={chain.isCommon}
        onValueChange={v => {
          try {
            if (!v) dispatch(removeCommonList(chain));
            // else NetworkOverlay.showAddChainInfo(chain);
            else dispatch(addCommonList(chain));
          } catch (error) {
            console.log(error, '====error');
          }
        }}
      />
    );
  }, [chain, dispatch]);
  return (
    <Touchable style={styles.itemRow} onPress={() => navigationService.navigate('NetworkDetails', { chain })}>
      {leftElement}
      <View style={styles.elementRow}>
        <TextL numberOfLines={1} style={styles.nameText}>
          {chain.networkName}
        </TextL>
        {rightElement}
      </View>
    </Touchable>
  );
}
export default memo(NetworkItem);

const styles = StyleSheet.create({
  elementRow: {
    flex: 1,
    height: pTd(48) + 24,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: defaultColors.border4,
    paddingRight: pTd(16),
  },
  itemRow: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: pTd(16),
  },
  nameText: {
    width: '70%',
  },
  lockStyle: {
    marginRight: pTd(15),
  },
  logoRow: {
    position: 'relative',
    marginRight: pTd(16),
  },
  selectedStyle: {
    position: 'absolute',
    zIndex: 999,
    right: -pTd(6),
    top: -2,
  },
});
