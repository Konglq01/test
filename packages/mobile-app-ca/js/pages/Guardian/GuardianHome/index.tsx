import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import PageContainer from 'components/PageContainer';
import { pageStyles } from './style';
import { useLanguage } from 'i18n/hooks';
import { useGuardianList } from 'hooks/useGuardianList';
import { useGuardiansInfo } from 'hooks/store';
import GuardianAccountItem from '../components/GuardianAccountItem';
import useVerifierList from 'hooks/useVerifierList';
import Touchable from 'components/Touchable';

export default function GuardianHome() {
  const { t } = useLanguage();
  useVerifierList();
  useGuardianList();

  const { userGuardiansList } = useGuardiansInfo();

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
