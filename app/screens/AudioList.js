import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { pause, play, playNext, resume } from '../misc/audioController';
import { Audio } from 'expo-av';
import { storeAudioForNextOpening } from '../misc/helper';
import color from '../misc/color';

class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
    };
    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    (i) => 'audio',
    (type, dim) => {
      switch (type) {
        case 'audio':
          dim.width = Dimensions.get('window').width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  // onPlaybackStatusUpdate = async (playbackStatus) => {
  //   if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
  //     this.context.updateState(this.context, {
  //       playbackPosition: playbackStatus.positionMillis,
  //       playbackDuration: playbackStatus.durationMillis,
  //     });
  //   }
  //   //console.log(playbackStatus);
  //   if (playbackStatus.didJustFinish) {
  //     const nextAudioIndex = this.context.currentAudioIndex + 1;
  //     if (nextAudioIndex >= this.context.totalAudioCount) {
  //       // end of audios.
  //       this.context.playbackObj.unloadAsync();
  //       this.context.updateState(this.context, {
  //         currentAudio: this.context.audioFiles[0],
  //         soundObj: null,
  //         isPlaying: false,
  //         currentAudioIndex: [0],
  //         playbackPosition: null,
  //         playbackDuration: null,
  //       });
  //       return storeAudioForNextOpening(this.context.audioFiles[0], 0);
  //     }
  //     const nextAudio = this.context.audioFiles[nextAudioIndex];
  //     const status = await playNext(this.context.playbackObj, nextAudio.uri);
  //     this.context.updateState(this.context, {
  //       currentAudio: nextAudio,
  //       soundObj: status,
  //       isPlaying: true,
  //       currentAudioIndex: nextAudioIndex,
  //     });
  //     return storeAudioForNextOpening(nextAudio, nextAudioIndex);
  //   }
  // };

  handleAudioPress = async (audio) => {
    // audio Object :
    // {
    //   "albumId": "518199398",
    //   "creationTime": 0,
    //   "duration": 273.788,
    //   "filename": "SRGM -1.aac",
    //   "height": 0,
    //   "id": "40185",
    //   "mediaType": "audio",
    //   "modificationTime": 1622253984000,
    //   "uri": "file:///storage/emulated/0/Music/Record/SoundRecord/SRGM -1.aac",
    //   "width": 0,
    // }

    const { soundObj, playbackObj, currentAudio, updateState, audioFiles } =
      this.context;
    //playing audio for first time
    if (soundObj === null) {
      const playbackObj = new Audio.Sound();
      const status = await play(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);
      // console.log(status) use this to see all params inside this status object
      updateState(this.context, {
        currentAudio: audio,
        playbackObj: playbackObj,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });

      playbackObj.setOnPlaybackStatusUpdate(
        this.context.onPlaybackStatusUpdate
      );
      return storeAudioForNextOpening(audio, index);
    }

    //pause audio if already playing
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await pause(playbackObj);
      return updateState(this.context, { soundObj: status, isPlaying: false });
    }

    // resume audio if clicked on same audio
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playbackObj);
      return updateState(this.context, { soundObj: status, isPlaying: true });
    }

    //play another audio
    if (soundObj.isLoaded && currentAudio.id != audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      const index = audioFiles.indexOf(audio);

      updateState(this.context, {
        currentAudio: audio,
        soundObj: status,
        isPlaying: true,
        currentAudioIndex: index,
      });
      return storeAudioForNextOpening(audio, index);
    }
  };

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true });
        }}
        onAudioPress={() => this.handleAudioPress(item)}
      />
    );
  };

  componentDidMount() {
    this.context.loadPreviousAudio();
  }

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) return null;
          return (
            <Screen style={{ flex: 1 }}>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                onPlayPress={() => console.log('Playing Audio')}
                onPlaylistPress={() => console.log('adding to Playlist')}
                currentItem={this.currentItem}
                onClose={() =>
                  this.setState({ ...this.state, optionModalVisible: false })
                }
                visible={this.state.optionModalVisible}
              />
            </Screen>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AudioList;