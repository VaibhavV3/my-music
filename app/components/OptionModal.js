import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import color from '../misc/color';

/**
 * @author
 * @function OptionModal
 **/
const OptionModal = ({
  visible,
  currentItem,
  onClose,
  onPlayPress,
  onPlaylistPress,
}) => {
  const { filename } = currentItem;
  return (
    <>
      <StatusBar hidde />
      <Modal animationType="slide" transparent visible={visible}>
        <View style={styles.modal}>
          <Text style={styles.title} numberOfLines={2}>
            {filename}
          </Text>
          <View style={styles.optionContainer}>
            <TouchableWithoutFeedback onPress={onPlayPress}>
              <Text style={styles.option}>Play</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onPlaylistPress}>
              <Text style={styles.option}>Add to Playlist</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modelBg} />
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: color.TERNARY,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000, //zindex is basically 3d view, z-axis value. so that this modal is above modalBg
  },
  optionContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 0,
    color: color.FONT_MEDIUM,
  },
  option: {
    fontSize: 16,
    fontWeight: 'bold',
    color: color.FONT,
    paddingVertical: 10,
    letterSpacing: 1,
  },
  modelBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: color.MODAL_BG,
  },
});
export default OptionModal;
