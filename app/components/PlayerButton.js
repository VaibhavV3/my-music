import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import color from '../misc/color';

/**
 * @author
 * @function PlayerButton
 **/
const PlayerButton = (props) => {
  const { iconType, size = 40, iconColor = color.PRIMARY, onPress } = props;

  const getIconName = (type) => {
    switch (type) {
      case 'PLAY':
        return 'pausecircle'; //related to play
      case 'PAUSE':
        return 'playcircleo'; //related to pause
      case 'NEXT':
        return 'forward'; //related to next
      case 'PREV':
        return 'banckward'; //related to previous
    }
  };
  return (
    <AntDesign
      onPress={onPress}
      name={getIconName(iconType)}
      size={size}
      color={iconColor}
      {...props}
    />
  );
};

export default PlayerButton;
