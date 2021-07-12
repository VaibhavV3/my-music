import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import color from '../misc/color';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { useContext } from 'react';
import { AudioContext } from '../context/AudioProvider';
import {
  pause,
  play,
  playNext,
  resume,
  moveAudio,
} from '../misc/audioController';
import { convertTime, storeAudioForNextOpening } from '../misc/helper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window').width;
/**
 * @author
 * @function Player
 **/
const Player = () => {
  var lottieSize = 16;

  const [currentPosition, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration } = context;
  const calculateSeekBar = () => {
    if (playbackDuration !== null && playbackPosition !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  };

  const renderCurrentTime = () => {
    if (!context.soundObj && context.currentAudio.lastPosition) {
      return convertTime(context.currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  };

  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  const handlePlayPause = async () => {
    // play
    if (context.soundObj === null) {
      const audio = context.currentAudio;
      const status = await play(context.playbackObj, audio.uri);
      context.playbackObj.setOnPlaybackStatusUpdate(
        context.onPlaybackStatusUpdate
      );
      return context.updateState(context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        changeLottie: false,
        currentAudioIndex: context.currentAudioIndex,
      });
    }
    // Pause
    if (context.soundObj && context.soundObj.isPlaying) {
      const status = await pause(context.playbackObj);
      return context.updateState(context, {
        soundObj: status,
        isPlaying: false,
        changeLottie: true,
      });
    }

    // Resume
    if (context.soundObj && !context.soundObj.isPlaying) {
      const status = await resume(context.playbackObj);
      return context.updateState(context, {
        soundObj: status,
        isPlaying: true,
        changeLottie: false,
      });
    }
  };

  const handleNext = async () => {
    // play next
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isLastAudio =
      context.currentAudioIndex + 1 === context.totalAudioCount;
    let audio = context.audioFiles[context.currentAudioIndex + 1];
    let index;
    let status;

    if (!isLastAudio) {
      index = context.currentAudioIndex + 1;
      if (isLoaded) status = await playNext(context.playbackObj, audio.uri);
      else status = await play(context.playbackObj, audio.uri);
    }

    if (isLastAudio) {
      index = 0;
      audio = context.audioFiles[index];
      if (isLoaded) status = await playNext(context.playbackObj, audio.uri);
      else status = await play(context.playbackObj, audio.uri);
    }

    context.updateState(context, {
      currentAudio: audio,
      playbackObj: context.playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
      changeLottie: true,
    });
    return storeAudioForNextOpening(audio, index);
  };

  const handlePrev = async () => {
    // play next
    const { isLoaded } = await context.playbackObj.getStatusAsync();
    const isFirstAudio = context.currentAudioIndex <= 0;
    let audio = context.audioFiles[context.currentAudioIndex - 1];
    let index;
    let status;

    if (!isFirstAudio) {
      index = context.currentAudioIndex - 1;
      if (isLoaded) status = await playNext(context.playbackObj, audio.uri);
      else status = await play(context.playbackObj, audio.uri);
    }

    if (isFirstAudio) {
      index = context.totalAudioCount - 1;
      audio = context.audioFiles[index];
      if (isLoaded) status = await playNext(context.playbackObj, audio.uri);
      else status = await play(context.playbackObj, audio.uri);
    }

    context.updateState(context, {
      currentAudio: audio,
      playbackObj: context.playbackObj,
      soundObj: status,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
      changeLottie: true,
    });
    return storeAudioForNextOpening(audio, index);
  };

  const getLottieAnimation = () => {
    let index = Math.floor(Math.random() * lottieSize);
    if (context.changeLottie) {
      context.updateState(context, {
        changeLottie: false,
        lottieIndex: index,
      });
    } else {
      index = context.lottieIndex;
    }
    //console.log(index);
    let src = '';
    switch (index) {
      case 0:
        src = require('./../../assets/love-couple-scene-8.json');
        break;
      case 1:
        src = require('./../../assets/love-couple-scene-13.json');
        break;
      case 2:
        src = require('./../../assets/animated-indonesian-first-president.json');
        break;
      case 3:
        src = require('./../../assets/circular-audio-spectrum.json');
        break;
      case 4:
        src = require('./../../assets/dance-party.json');
        break;
      case 5:
        src = require('./../../assets/dino-dance.json');
        break;
      case 6:
        src = require('./../../assets/love-icon-animation.json');
        break;
      case 7:
        src = require('./../../assets/marriage-couple-hugging.json');
        break;
      case 8:
        src = require('./../../assets/music-note-character.json');
        break;
      case 9:
        src = require('./../../assets/pineapple-yoga-with-music.json');
        break;
      case 10:
        src = require('./../../assets/red-cube.json');
        break;
      case 11:
        src = require('./../../assets/rooftop.json');
        break;
      case 12:
        src = require('./../../assets/singthesong.json');
        break;
      case 13:
        src = require('./../../assets/warp-speed-ring.json');
        break;
      case 14:
        src = require('./../../assets/beach-dance.json');
        break;
      case 15:
        src = require('./../../assets/birthday-cake-celebration.json');
        break;
    }
    //console.log(src);
    return (
      <LottieView
        source={src}
        autoPlay
        loop
        width={width}
        backgroundColor={color.APPLICATION_BG}
      />
    );
  };

  const changeLottieView = () => {
    if (!context.isPlaying) return;
    let ind = context.lottieIndex + 1;
    ind = ind % lottieSize;
    //console.log(ind);
    context.updateState(context, {
      changeLottie: false,
      lottieIndex: ind,
    });
  };

  if (!context.currentAudio) return null;

  return (
    <View style={styles.container}>
      <View
        style={styles.midBannerContainer}
        removeClippedSubviews={false}
        onStartShouldSetResponder={changeLottieView}
      >
        {context.isPlaying ? (
          getLottieAnimation()
        ) : (
          <MaterialCommunityIcons
            name="music-circle"
            size={300}
            color={color.SECONDARY}
          />
        )}
      </View>
      <View style={styles.audioPlayerContainer}>
        <View style={styles.audioTextTitle}>
          <Text numberOfLines={1} style={{ color: color.SECONDARY }}>
            {context.currentAudio.filename}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingHorizontal: 15,
            }}
          >
            <Text style={{ color: color.SECONDARY }}>
              {currentPosition ? currentPosition : renderCurrentTime()}/
            </Text>
            <Text style={{ color: color.SECONDARY }}>
              {convertTime(context.currentAudio.duration)}
            </Text>
          </View>
        </View>
        <Slider
          style={{ width: width, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={calculateSeekBar()}
          minimumTrackTintColor={color.SECONDARY}
          maximumTrackTintColor={color.PRIMARY}
          onValueChange={(value) => {
            setCurrentPosition(
              convertTime(value * context.currentAudio.duration)
            );
          }}
          onSlidingStart={async () => {
            if (!context.isPlaying) return;

            try {
              await pause(context.playbackObj);
            } catch (error) {
              console.log('error inside onSlidingStart callback', error);
            }
          }}
          onSlidingComplete={async (value) => {
            await moveAudio(context, value);
            setCurrentPosition(0);
          }}
        />
        <View style={styles.audioControllers}>
          <PlayerButton iconType="PREV" onPress={handlePrev} />
          <PlayerButton
            onPress={handlePlayPause}
            style={{ marginHorizontal: 25 }}
            iconType={context.isPlaying ? 'PLAY' : 'PAUSE'}
          />
          <PlayerButton iconType="NEXT" onPress={handleNext} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: color.APPLICATION_BG,
  },
  audioCount: {
    textAlign: 'right',
    color: color.SECONDARY,
    fontSize: 14,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioText: {
    flexDirection: 'column',
    padding: 15,
  },
  audioTextTitle: {
    fontSize: 16,
    color: color.SECONDARY,
  },
  audioControllers: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5,
  },
  audioPlayerContainer: {
    padding: StatusBar.currentHeight,
    backgroundColor: color.FIVE,
    borderTopRightRadius: 34,
    borderTopLeftRadius: 34,
  },
});
export default Player;
