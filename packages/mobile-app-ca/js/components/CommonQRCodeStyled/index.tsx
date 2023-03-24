import React from 'react';
import QRCodeStyled, { SVGQRCodeStyledProps } from 'react-native-qrcode-styled';
import portkeyLogo from 'assets/image/pngs/portkeyBlackBorderRadius.png';
import { pTd } from 'utils/unit';

type CommonQRCodeStyledPropsType = {
  qrData: string;
} & SVGQRCodeStyledProps;

const BorderRadiusMap = {
  style1: {
    outerBorderRadius: 17,
    innerBorderRadius: 8,
  },
  style2: {
    outerBorderRadius: 10,
    innerBorderRadius: 4,
  },
};

export default function CommonQRCodeStyled(props: CommonQRCodeStyledPropsType) {
  const { qrData } = props;

  return (
    <QRCodeStyled
      data={qrData}
      padding={0}
      pieceSize={5}
      isPiecesGlued
      pieceBorderRadius={2}
      color={'#000000'}
      logo={{
        href: portkeyLogo,
        scale: 1.5,
        padding: pTd(5),
        hidePieces: false,
      }}
      outerEyesOptions={{
        topLeft: {
          borderRadius: BorderRadiusMap.style2.outerBorderRadius,
        },
        topRight: {
          borderRadius: BorderRadiusMap.style2.outerBorderRadius,
        },
        bottomLeft: {
          borderRadius: BorderRadiusMap.style2.outerBorderRadius,
        },
      }}
      innerEyesOptions={{
        topLeft: {
          borderRadius: BorderRadiusMap.style2.innerBorderRadius,
        },
        topRight: {
          borderRadius: BorderRadiusMap.style2.innerBorderRadius,
        },
        bottomLeft: {
          borderRadius: BorderRadiusMap.style2.innerBorderRadius,
        },
      }}
      {...props}
    />
  );
}
