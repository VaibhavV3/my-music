import React, { Component, createContext } from 'react';
import { View, Text, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { storeAudioForNextOpening } from '../misc/helper';
import { playNext } from '../misc/audioController';

export const AudioContext = createContext();

class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
      changeLottie: false,
      lottieIndex: 0,
    };
    this.totalAudioCount = 0;
  }

  permissionAlert = () => {
    Alert.alert('Permission Required', 'This app needs to read audio files!', [
      {
        text: 'I am ready',
        onPress: () => this.getPermission(),
      },
      {
        text: 'Cancel',
        onPress: () => this.permissionAlert(),
      },
    ]);
  };

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio', // audio, photo, video, unknown options available
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio', // audio, photo, video, unknown options available
      first: media.totalCount,
    });

    // filteredAssets = [];
    // for (let index = 0; index < media.assets.length; index++) {
    //   console.log(index);
    //   if (media.assets[index] > 10) {
    //     filteredAssets[index] = media.assets[index];
    //   }
    // }
    // //console.log(filteredAssets);
    // console.log(media);
    // media['assets'] = filteredAssets;

    //console.log(media.assets);
    this.totalAudioCount = media.totalCount;

    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([
        ...audioFiles,
        ...media.assets,
      ]),
      audioFiles: [...audioFiles, ...media.assets],
    });
  };

  loadPreviousAudio = async () => {
    let previousAudio = await AsyncStorage.getItem('previousAudio');
    let currentAudio;
    let currentAudioIndex;

    if (previousAudio == null) {
      currentAudio = this.state.audioFiles[0];
      currentAudioIndex = 0;
    } else {
      previousAudio = JSON.parse(previousAudio);
      currentAudio = previousAudio.audio;
      currentAudioIndex = previousAudio.index;
    }

    this.setState({ ...this.state, currentAudio, currentAudioIndex });
  };

  getPermission = async () => {
    // Object {
    //   "canAskAgain": true,
    //   "expires": "never",
    //   "granted": false,
    //   "status": "undetermined",
    // }
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
      // get All audio files.
      this.getAudioFiles();
    }

    if (!permission.granted && !permission.canAskAgain) {
      // we are going to display an error.
      this.setState({ ...this.state, permissionError: true });
    }

    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      if (status === 'denied' && canAskAgain) {
        // we are going to display an alert user must allow this permission.
        this.permissionAlert();
      }

      if (status === 'granted') {
        // get All audio files.
        this.getAudioFiles();
      }

      if (status === 'denied' && !canAskAgain) {
        // we are going to display an error.
        this.setState({ ...this.state, permissionError: true });
      }
    }
  };

  onPlaybackStatusUpdate = async (playbackStatus) => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.updateState(this, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }
    //console.log(playbackStatus);
    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = this.state.currentAudioIndex + 1;
      if (nextAudioIndex >= this.totalAudioCount) {
        // end of audios.
        this.state.playbackObj.unloadAsync();
        this.updateState(this, {
          currentAudio: this.state.audioFiles[0],
          soundObj: null,
          isPlaying: false,
          currentAudioIndex: [0],
          playbackPosition: null,
          playbackDuration: null,
        });
        return storeAudioForNextOpening(this.state.audioFiles[0], 0);
      }
      const nextAudio = this.state.audioFiles[nextAudioIndex];
      const status = await playNext(this.state.playbackObj, nextAudio.uri);
      this.updateState(this, {
        currentAudio: nextAudio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
      return storeAudioForNextOpening(nextAudio, nextAudioIndex);
    }
  };

  componentDidMount() {
    this.getPermission();
    if (this.state.playbackObj === null) {
      this.setState({ ...this.state, playbackObj: new Audio.Sound() });
    }
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };

  render() {
    const {
      audioFiles,
      dataProvider,
      permissionError,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      playbackPosition,
      playbackDuration,
      changeLottie,
      lottieIndex,
    } = this.state;
    if (permissionError)
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 25, textAlign: 'center', color: 'red' }}>
            Cannot access anything because permission not given
          </Text>
        </View>
      );
    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          dataProvider,
          playbackObj,
          soundObj,
          currentAudio,
          playbackPosition,
          playbackDuration,
          isPlaying,
          currentAudioIndex,
          totalAudioCount: this.totalAudioCount,
          changeLottie,
          lottieIndex,
          updateState: this.updateState,
          loadPreviousAudio: this.loadPreviousAudio,
          onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;
