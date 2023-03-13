import { screenHeight } from '@portkey-wallet/utils/mobile/device';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Touchable from 'components/Touchable';
import PageContainer from 'components/PageContainer';
import { countryCodeIndex, countryCodeFilter } from '@portkey-wallet/constants/constants-ca/countryCode';
import GStyles from 'assets/theme/GStyles';
import IndexBarLargeList from 'components/CommonLargeList/IndexBarLargeList';
import CommonInput from 'components/CommonInput';
import { CountryItem } from '@portkey-wallet/constants/constants-ca';
import myEvents from 'utils/deviceEvent';
import navigationService from 'utils/navigationService';

const List = countryCodeIndex.map(i => ({ index: i[0], items: i[1] }));

export default function SelectCountry() {
  const [searchList, setSearchList] = useState<CountryItem[]>();
  const data = useMemo(() => searchList || List, [searchList]);
  const _renderItem = ({ section, row }: { section: number; row: number }) => {
    let item: CountryItem;
    if ('items' in data[section]) {
      item = (data[section] as { items: CountryItem[] }).items[row];
    } else {
      item = data[row] as CountryItem;
    }
    return (
      <Touchable
        style={styles.itemRow}
        onPress={() => {
          myEvents.setCountry.emit(item);
          navigationService.goBack();
        }}>
        <Text>
          {item.country} {item.code}
        </Text>
      </Touchable>
    );
  };
  const _renderSection = (index: any) => {
    const contact = List[index];
    return (
      <View style={styles.sectionRow}>
        <Text>{contact.index}</Text>
      </View>
    );
  };
  return (
    <PageContainer
      titleDom="Select country/region"
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: true }}>
      <CommonInput type="search" onChangeText={s => setSearchList(!s ? undefined : countryCodeFilter(s))} />
      <IndexBarLargeList
        extraHeight={20}
        sectionHeight={searchList ? 0 : 20}
        indexHeight={40}
        data={data}
        topOffset={screenHeight * 0.05}
        indexArray={searchList ? undefined : countryCodeIndex.map(item => item[0])}
        renderItem={_renderItem}
        renderSection={searchList ? undefined : _renderSection}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    height: 40,
  },
  sectionRow: {
    height: 20,
    backgroundColor: 'red',
  },
  containerStyles: {
    ...GStyles.paddingArg(0),
  },
});
