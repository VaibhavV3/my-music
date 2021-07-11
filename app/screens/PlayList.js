import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import PictureSlide from '../components/PictureSlide';

/**
 * @author
 * @function PlayList
 **/
const PlayList = (props) => {
  const { container } = styles;
  return (
    <View style={container}>
      <PictureSlide />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default PlayList;
