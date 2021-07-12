import React from 'react';
import { View, StyleSheet, StatusBar, Dimensions } from 'react-native';
import color from '../misc/color';

/**
 * @author
 * @function Screen
 **/
const Screen = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.APPLICATION_BG,
    paddingTop: StatusBar.currentHeight, // this doesn't work for ios, use expo-constants api.
  },
});
export default Screen;
