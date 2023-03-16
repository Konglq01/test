import { bottomBarHeight, screenHeight } from '@portkey-wallet/utils/mobile/device';
import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Touchable from 'components/Touchable';
import PageContainer from 'components/PageContainer';
import { countryCodeIndex, countryCodeFilter } from '@portkey-wallet/constants/constants-ca/countryCode';
import GStyles from 'assets/theme/GStyles';
import IndexBarLargeList from 'components/CommonLargeList/IndexBarLargeList';
import CommonInput from 'components/CommonInput';
import { CountryItem } from '@portkey-wallet/constants/constants-ca';
import myEvents from 'utils/deviceEvent';
import navigationService from 'utils/navigationService';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import NoData from 'components/NoData';
import { headerHeight } from 'components/CustomHeader/style/index.style';

const IndexHeight = 56,
  SectionHeight = 20;
const List = countryCodeIndex.map(i => ({ index: i[0], items: i[1] }));

export default function SelectCountry() {
  const { selectCountry } = useRouterParams<{ selectCountry?: CountryItem }>();
  console.log(selectCountry, '=====selectCountry');

  const [searchList, setSearchList] = useState<CountryItem[]>();
  const data = useMemo(() => searchList || List, [searchList]);
  const _renderItem = ({ section, row }: { section: number; row: number }) => {
    let item: CountryItem;
    if ('items' in data[section]) {
      item = (data[section] as { items: CountryItem[] }).items[row];
    } else {
      item = data[row] as CountryItem;
    }
    const isSelected = selectCountry?.code === item.code;
    return (
      <Touchable
        style={[styles.itemRow, GStyles.itemCenter, GStyles.spaceBetween]}
        onPress={() => {
          myEvents.setCountry.emit(item);
          navigationService.goBack();
        }}>
        <TextL style={isSelected ? FontStyles.font4 : null}>{item.country}</TextL>
        <TextM style={[FontStyles.font3, isSelected ? FontStyles.font4 : null]}>+ {item.code}</TextM>
      </Touchable>
    );
  };
  const _renderSection = (index: any) => {
    const contact = List[index];
    return (
      <View style={styles.sectionRow}>
        <TextL style={FontStyles.font7}>{contact.index}</TextL>
      </View>
    );
  };
  console.log(data, '======data');

  return (
    <PageContainer
      titleDom="Select country/region"
      safeAreaColor={['blue', 'white']}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      <View style={styles.inputContainerStyle}>
        <CommonInput
          placeholder="Search countries and region"
          type="search"
          onChangeText={s => setSearchList(!s ? undefined : countryCodeFilter(s))}
        />
      </View>
      <IndexBarLargeList
        extraHeight={headerHeight + bottomBarHeight + 150}
        sectionHeight={searchList ? 0 : SectionHeight}
        indexHeight={IndexHeight}
        data={data}
        indexBarBoxStyle={styles.indexBarBoxStyle}
        indexArray={searchList ? undefined : countryCodeIndex.map(item => item[0])}
        renderItem={_renderItem}
        renderSection={searchList ? undefined : _renderSection}
        renderEmpty={() => <NoData topDistance={64} noPic message={'There is no search result.'} />}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    height: IndexHeight,
    paddingLeft: pTd(20),
    paddingRight: pTd(40),
  },
  sectionRow: {
    paddingHorizontal: pTd(20),
    height: SectionHeight,
    backgroundColor: defaultColors.bg1,
  },
  containerStyles: {
    ...GStyles.paddingArg(10, 0),
    backgroundColor: defaultColors.bg1,
  },
  inputContainerStyle: {
    marginBottom: 20,
    paddingHorizontal: pTd(20),
  },
  indexBarBoxStyle: { top: 20, bottom: screenHeight > 850 ? 100 : 60 },
});
