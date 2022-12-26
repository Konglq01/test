import React from 'react';
import { Switch, SwitchProps } from 'react-native';
import { defaultColors } from 'assets/theme';
import { isIOS } from '@rneui/base';

const CommonSwitch = (props: SwitchProps) => {
  return <Switch thumbColor={isIOS ? defaultColors.bg1 : defaultColors.bg5} {...props} />;
};

export default CommonSwitch;
