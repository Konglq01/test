import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { screenWidth } from 'utils/device';
import Collapsible from '../Collapsible';
const Dropdown = forwardRef(
  (
    { CloseDropDown, onHeight, children }: { onHeight: number; children: React.ReactNode; CloseDropDown?: () => void },
    ref,
  ) => {
    const [isModal, setIsModal] = useState<boolean>();
    const [display, setDisplay] = useState<boolean>();
    const timer1 = useRef<NodeJS.Timeout>();
    const timer2 = useRef<NodeJS.Timeout>();
    const showModal = () => {
      setIsModal(true);
      timer1.current = setTimeout(() => {
        setDisplay(true);
      }, 300);
    };
    const closeModal = () => {
      CloseDropDown?.();
      setDisplay(false);
      timer2.current = setTimeout(() => {
        setIsModal(false);
      }, 300);
    };
    useImperativeHandle(ref, () => ({ showModal, closeModal }), []);

    useEffect(() => {
      return () => {
        timer1.current && clearTimeout(timer1.current);
        timer1.current && clearTimeout(timer1.current);
      };
    });
    return (
      <Modal animationType="none" transparent={true} visible={isModal} onRequestClose={closeModal}>
        <View style={styles.Box}>
          <TouchableOpacity activeOpacity={1} style={[styles.onCloseBox, { height: onHeight }]} onPress={closeModal} />
          <Collapsible duration={300} collapsed={!display}>
            {children}
          </Collapsible>
          <TouchableOpacity activeOpacity={1} style={styles.closeBox} onPress={closeModal} />
        </View>
      </Modal>
    );
  },
);

Dropdown.displayName = 'Dropdown';
export default Dropdown;

const styles = StyleSheet.create({
  Box: {
    flex: 1,
  },
  onCloseBox: {
    width: screenWidth,
  },
  closeBox: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
});
