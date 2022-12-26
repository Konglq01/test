import React, { ReactNode } from 'react';
import OverlayModal from '../OverlayModal';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import { styles } from './style/style';
import { TextM, TextTitle } from 'components/CommonText';
import ButtonRow, { ButtonRowProps } from 'components/ButtonRow';

const show = (
  items: {
    title: string;
    onPress?: (v: any) => void;
  }[],
  cancelItem?: {
    title: string;
  },
) => {
  Keyboard.dismiss();
  OverlayModal.show(
    <>
      <View style={styles.sheetBox}>
        {items.map((item, index) => {
          const { title, onPress } = item;
          return (
            <TouchableOpacity
              key={index}
              style={styles.itemBox}
              onPress={() => {
                OverlayModal.hide();
                onPress?.(item);
              }}>
              <Text style={styles.itemText}>{title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {cancelItem && (
        <TouchableOpacity onPress={() => OverlayModal.hide()} style={styles.cancelBox}>
          <Text style={styles.cancelText}>{cancelItem.title}</Text>
        </TouchableOpacity>
      )}
    </>,
    {
      position: 'bottom',
    },
  );
};

type AlertBodyProps = {
  title?: string;
  message?: ReactNode;
  message2?: ReactNode;
  buttons?: ButtonRowProps['buttons'];
};

function AlertBody({ title, message, buttons, message2 }: AlertBodyProps) {
  return (
    <View style={styles.alertBox}>
      {title ? <TextTitle style={styles.alertTitle}>{title}</TextTitle> : null}
      {typeof message === 'string' ? <TextM style={styles.alertMessage}>{message}</TextM> : message}
      {typeof message2 === 'string' ? <TextM style={styles.alertMessage}>{message2}</TextM> : message2}
      <ButtonRow
        buttons={buttons?.map(i => ({
          ...i,
          onPress: () => {
            OverlayModal.hide();
            i.onPress?.();
          },
        }))}
      />
    </View>
  );
}

const alert = (props: AlertBodyProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<AlertBody {...props} />, {
    modal: true,
    type: 'zoomOut',
    position: 'center',
  });
};
export default {
  show,
  alert,
};
