import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import React from 'react';
import { pTd } from 'utils/unit';
export type CheckIconProps = {
  checked?: boolean;
  onPress?: (checked: boolean) => void;
  size?: string | number;
};
export default function CheckIcon({ checked, onPress, size = pTd(16) }: CheckIconProps) {
  return (
    <Touchable onPress={() => onPress?.(!checked)}>
      <Svg size={size} icon={checked ? 'check-true' : 'check-false'} />
    </Touchable>
  );
}
