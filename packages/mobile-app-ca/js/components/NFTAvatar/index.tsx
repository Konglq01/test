import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import { defaultColors } from 'assets/theme';
import Svg from 'components/Svg';
import { Image } from '@rneui/themed';
import { both } from 'ramda';
import GStyles from 'assets/theme/GStyles';

export type NoDataPropsType = {
  style?: ViewStyle | ViewStyle[];
  data?: any;
  onPress?: () => void;
};

const mockNFTUrl =
  'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/fotojet-5-1650369753.jpg?crop=0.498xw:0.997xh;0,0&resize=640:*';

// const mockNFTUrl = '';

const NFTAvatar: React.FC<NoDataPropsType> = props => {
  const { style = {}, data, onPress } = props;

  const outStyles = Array.isArray(style) ? style : [style];

  return (
    <TouchableOpacity style={[styles.wrap, ...outStyles]} onPress={onPress}>
      {mockNFTUrl && (
        <Image
          source={{
            uri: mockNFTUrl,
          }}
          containerStyle={styles.img}
        />
      )}
      <TextL
        numberOfLines={mockNFTUrl ? 1 : 2}
        ellipsizeMode="tail"
        style={[styles.title, !!mockNFTUrl && styles.titleNoPic]}>
        {data?.symbol}
      </TextL>
      <TextM style={[styles.id, !!mockNFTUrl && styles.idNoPic]}>{'#2001'}</TextM>
      {mockNFTUrl && <View style={styles.mask} />}
    </TouchableOpacity>
  );
};
export default memo(NFTAvatar);

const styles = StyleSheet.create({
  wrap: {
    width: pTd(98),
    height: pTd(98),
    ...GStyles.paddingArg(12, 8),
    borderRadius: pTd(8),
    overflow: 'hidden',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: defaultColors.bg4,
  },
  img: {
    position: 'absolute',
    width: pTd(98),
    height: pTd(98),
  },
  title: {
    color: defaultColors.font5,
    lineHeight: pTd(20),
  },
  titleNoPic: {
    zIndex: 100,
    position: 'absolute',
    color: defaultColors.font2,
    left: pTd(8),
    bottom: pTd(20),
  },
  id: {
    position: 'absolute',
    bottom: pTd(12),
    left: pTd(8),
    lineHeight: pTd(16),
  },
  idNoPic: {
    zIndex: 100,
    position: 'absolute',
    bottom: 0,
    color: defaultColors.font2,
  },
  message: {
    color: defaultColors.font7,
    lineHeight: pTd(22),
    textAlign: 'center',
  },
  mask: {
    position: 'absolute',
    width: pTd(98),
    height: pTd(40),
    bottom: 0,
    backgroundColor: 'black',
    opacity: 0.25,
    shadowOffset: {
      width: pTd(10),
      height: -pTd(10),
    },
    shadowRadius: pTd(6),
  },
});
