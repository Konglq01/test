import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import React, { useCallback, useEffect, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pageStyles } from './style';
import { useLanguage } from 'i18n/hooks';
import { useGuardiansInfo } from 'hooks/store';
import GuardianAccountItem from '../components/GuardianAccountItem';
import Touchable from 'components/Touchable';
import { useCurrentWalletInfo } from '@portkey/hooks/hooks-ca/wallet';
import { useGetHolderInfo } from 'hooks/guardian';
import useEffectOnce from 'hooks/useEffectOnce';
import myEvents from 'utils/deviceEvent';
import { UserGuardianItem } from '@portkey/store/store-ca/guardians/type';

export default function GuardianHome() {
  const { t } = useLanguage();

  const { userGuardiansList } = useGuardiansInfo();

  const { caHash } = useCurrentWalletInfo();
  const userGuardiansListRef = useRef<UserGuardianItem[]>();
  userGuardiansListRef.current = userGuardiansList;

  const getGuardiansList = useGetHolderInfo();
  const refreshGuardiansList = useCallback(async () => {
    const preGuardiansListString = JSON.stringify(userGuardiansListRef.current);
    try {
      await new Promise(resolve => {
        let times = 0;
        const timer = setInterval(async () => {
          times++;
          try {
            await getGuardiansList({
              caHash,
            });
          } catch (err) {
            console.log(err);
          }

          console.log(times, userGuardiansListRef.current);
          if (preGuardiansListString !== JSON.stringify(userGuardiansListRef.current)) {
            clearInterval(timer);
            resolve(true);
          } else if (times >= 5) {
            console.log('too many times');
            clearInterval(timer);
          }
        }, 1000);
      });
    } catch (error) {
      console.log('error', error);
    }
  }, [caHash, getGuardiansList]);

  useEffectOnce(() => {
    getGuardiansList({
      caHash,
    });
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
        {userGuardiansList?.map((guardian, idx) => (
          <Touchable
            key={idx}
            onPress={() => {
              navigationService.navigate('GuardianDetail', { guardian: JSON.stringify(guardian) });
            }}>
            <GuardianAccountItem
              guardianItem={guardian}
              isButtonHide
              renderBtn={renderGuardianBtn}
              isBorderHide={idx === userGuardiansList.length - 1}
            />
          </Touchable>
        ))}
      </View>
    </PageContainer>
  );
}
