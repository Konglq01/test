import React, { memo, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PageContainer from 'components/PageContainer';
// import { GStyle, Colors } from '../../../../assets/theme';
import Collapsible from 'components/Collapsible';
// import i18n from 'i18n-js';
// import { pTd } from '../../../../utils/common';
// import { TextL, TextM } from '../../../../components/template/CommonText';
import Entypo from 'react-native-vector-icons/Entypo';
import { PageStyle as styles } from './style';
import { list } from '../config';

interface ItemTypes {
  title?: string;
  details?: string;
  collapsed: boolean;
  onPress: () => void;
}

const Item = (props: ItemTypes) => {
  const { details, collapsed, title, onPress } = props;
  const Components = useMemo(() => {
    return (
      <Collapsible collapsed={collapsed}>
        <Text>{details}</Text>
      </Collapsible>
    );
  }, [details, collapsed]);

  return (
    <View style={styles.bottomBox}>
      <TouchableOpacity onPress={onPress} style={styles.titleBox}>
        <Text>{title}</Text>
        {collapsed ? <Entypo name="chevron-down" size={40} /> : <Entypo color={'red'} name="chevron-up" size={40} />}
      </TouchableOpacity>
      {Components}
    </View>
  );
};

const HelpAndFeedBack = () => {
  const [selected, setSelected] = useState<number>(-1);

  return (
    <PageContainer>
      {list.map((item, index) => {
        return (
          <Item
            key={index}
            {...item}
            collapsed={!(selected === index)}
            onPress={() => setSelected(selected === index ? -1 : index)}
          />
        );
      })}
    </PageContainer>
  );
};

export default memo(HelpAndFeedBack);
