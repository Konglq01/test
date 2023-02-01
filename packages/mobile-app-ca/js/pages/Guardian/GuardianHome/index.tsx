import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import React, { useCallback, useEffect, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pageStyles } from './style';
import { useLanguage } from 'i18n/hooks';
import { useGuardiansInfo } from 'hooks/store';
import GuardianItem from '../components/GuardianItem';
import Touchable from 'components/Touchable';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { useGetGuardiansInfoWriteStore } from 'hooks/guardian';
import useEffectOnce from 'hooks/useEffectOnce';
import myEvents from 'utils/deviceEvent';
import CommonToast from 'components/CommonToast';

export default function GuardianHome() {
  const { t } = useLanguage();

  const { userGuardiansList } = useGuardiansInfo();
  const guardianList = useMemo(() => {
    if (!userGuardiansList) return [];
    return [...userGuardiansList].reverse();
  }, [userGuardiansList]);

  const { caHash } = useCurrentWalletInfo();

  const getGuardiansInfoWriteStore = useGetGuardiansInfoWriteStore();
  const refreshGuardiansList = useCallback(async () => {
    try {
      await getGuardiansInfoWriteStore({
        caHash,
      });
    } catch (error) {
      // TODO: remove Toast
      CommonToast.failError(error);
    }
  }, [caHash, getGuardiansInfoWriteStore]);

  useEffectOnce(() => {
    refreshGuardiansList();
  });

  useEffect(() => {
    const listener = myEvents.refreshGuardiansList.addListener(() => {
      console.log('listener:refreshGuardiansList----');
      refreshGuardiansList();
    });
    return () => {
      listener.remove();
    };
  }, [refreshGuardiansList]);

  const renderGuardianBtn = useCallback(
    () => <Svg icon="right-arrow" color={defaultColors.icon1} size={pTd(16)} />,
    [],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={t('Guardians')}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: false }}
      rightDom={
        <TouchableOpacity
          onPress={() => {
            navigationService.navigate('GuardianEdit');
          }}>
          <Svg icon="add1" size={pTd(20)} color={defaultColors.font2} />
        </TouchableOpacity>
      }>
      <View>
        {guardianList.map((guardian, idx) => (
          <Touchable
            key={idx}
            onPress={() => {
              navigationService.navigate('GuardianDetail', { guardian: JSON.stringify(guardian) });
            }}>
            <GuardianItem
              guardianItem={guardian}
              isButtonHide
              renderBtn={renderGuardianBtn}
              isBorderHide={idx === guardianList.length - 1}
            />
          </Touchable>
        ))}
      </View>
    </PageContainer>
  );
}
