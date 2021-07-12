import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';

const getThumbnailText = (filename) => filename[0].toUpperCase();

const convertTime = (minutes) => {
  // minutes is actually seconds..
  if (minutes) {
    const hrs = minutes / 60;
    const minute = hrs.toString().split('.')[0];
    const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
    const sec = Math.ceil((60 * percent) / 100);

    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`;
    }

    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`;
    }

    if (sec < 10) {
      return `${minute}:0${sec}`;
    }

    return `${minute}:${sec}`;
  }
};

const renderPlayPauseIcon = (isPlaying) => {
  if (isPlaying) {
    //return play Icon
    return <Entypo name="controller-paus" size={24} color={color.FIVE} />;
  }
  //return pause icon
  return <Entypo name="controller-play" size={24} color={color.FIVE} />;
};

/**
 * @author
 * @function AudioListItem
 **/
const AudioListItem = ({
  title,
  duration,
  isPlaying,
  onOptionPress,
  onAudioPress,
  activeListItem,
}) => {
  const { container } = styles;
  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                {
                  backgroundColor: activeListItem
                    ? color.SECONDARY
                    : color.FIVE,
                },
              ]}
            >
              <Text style={styles.thumbnailText}>
                {activeListItem
                  ? renderPlayPauseIcon(isPlaying)
                  : getThumbnailText(title)}
              </Text>
            </View>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              <Text style={styles.timeText}>{convertTime(duration)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {/* <View style={styles.rightContainer}>
          <Entypo
            onPress={onOptionPress}
            name="dots-three-vertical"
            size={20}
            color={color.FIVE}
            style={{ padding: 10 }}
          />
        </View> */}
      </View>
      <View style={styles.separator} />
    </>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: width - 40,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    height: 50,
    flexBasis: 50,
    backgroundColor: color.FIVE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: color.SECONDARY,
  },
  titleContainer: {
    width: width - 140,
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    color: color.FIVE,
  },
  separator: {
    width: width - 40,
    backgroundColor: color.TERNARY,
    opacity: 0.3,
    height: 0.5,
    alignSelf: 'center',
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    color: color.TERNARY,
  },
});
export default AudioListItem;
