import React, { useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import { useNetworkInitialization, useNetworkList } from '@portkey-wallet/hooks/network';
import CustomScreen from './components/CustomScreen';
import AllScreen from './components/AllScreen';
import CommonScreen from './components/CommonScreen';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import CommonInput from 'components/CommonInput';
import { strIncludes } from '@portkey-wallet/utils';
import { useNavigation } from '@react-navigation/native';
import CommonTopTab from 'components/CommonTopTab';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { View } from 'react-native';
import styles from './styles';
import { useLanguage } from 'i18n/hooks';
const scrollViewProps = { disabled: true };
export default function ManageNetwork() {
  useNetworkInitialization();
  const { cmsList, customList, commonList } = useNetworkList();
  const [search, setSearch] = useState<string>();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const tabList = useMemo(() => {
    return [
      {
        name: t('Favorites'),
        tabItemDom: (
          <View style={styles.container}>
            <CommonScreen
              isSearch={!!search}
              networkList={commonList.filter(chain => strIncludes(chain.networkName, search || ''))}
            />
          </View>
        ),
      },
      {
        name: t('Networks'),
        tabItemDom: (
          <View style={styles.container}>
            <AllScreen
              isSearch={!!search}
              networkList={cmsList.filter(chain => strIncludes(chain.networkName, search || ''))}
            />
          </View>
        ),
      },
      {
        name: t('Custom'),
        tabItemDom: (
          <View style={styles.container}>
            <CustomScreen
              isSearch={!!search}
              networkList={customList.filter(chain => strIncludes(chain.networkName, search || ''))}
            />
          </View>
        ),
      },
    ];
  }, [cmsList, commonList, customList, search, t]);
  return (
    <PageContainer
      titleDom={t('Manage Networks')}
      safeAreaColor={['blue', 'white']}
      scrollViewProps={scrollViewProps}
      containerStyles={styles.container}
      leftCallback={navigation.goBack}
      rightDom={
        <Touchable onPress={() => navigationService.navigate('NetworkDetails')}>
          <Svg icon="add1" size={pTd(17.5)} color={defaultColors.font2} />
        </Touchable>
      }>
      <View style={styles.inputWrap}>
        <CommonInput placeholder={t('Search Network Name')} onChangeText={setSearch} />
      </View>
      <CommonTopTab initialRouteName={t('Favorites')} tabList={tabList} />
    </PageContainer>
  );
}
