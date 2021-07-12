// play audio
export const play = async (playbackObj, uri) => {
  try {
    return await playbackObj.loadAsync({ uri }, { shouldPlay: true });
  } catch (error) {
    console.log('Error inside play helper method', error.message);
  }
};

// pause audio
export const pause = async (playbackObj, uri) => {
  try {
    return await playbackObj.setStatusAsync({ shouldPlay: false });
  } catch (error) {
    console.log('Error inside pause helper method', error.message);
  }
};

// resume audio
export const resume = async (playbackObj, uri) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log('Error inside resume helper method', error.message);
  }
};

// select another audio
export const playNext = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (error) {
    console.log('Error inside playNext helper method', error.message);
  }
};

export const moveAudio = async (context, value) => {
  const { soundObj, isPlaying, playbackObj, updateState } = context;
  if (soundObj === null || !isPlaying) return;

  try {
    const status = await playbackObj.setPositionAsync(
      Math.floor(soundObj.durationMillis * value)
    );
    updateState(context, {
      soundObj: status,
      playbackPosition: status.positionMillis,
      isPlaying: true,
    });
    //console.log(status);

    const st = await resume(playbackObj);
    updateState(context, {
      soundObj: st,
      playbackPosition: st.positionMillis,
      isPlaying: true,
    });
    //console.log(st);
  } catch (error) {
    console.log('error inside onSlidingComplete callback', error);
  }
};
