import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAudioForNextOpening = async (audio, index) => {
  AsyncStorage.setItem('previousAudio', JSON.stringify({ audio, index }));
};

export const addImageToList = async (imagePath) => {
  //await AsyncStorage.clear();
  const list = await AsyncStorage.getItem('ImageList');
  let imageCount = Number(await AsyncStorage.getItem('ImageCount'));
  if (imageCount == null) {
    imageCount = 0;
  }
  let images = [];
  if (list !== null) {
    images = JSON.parse(list);
  }
  //console.log(imageCount);
  images[imageCount] = {
    path: imagePath,
    key: imageCount + '',
  };
  //console.log(images);
  imageCount = imageCount + 1;
  AsyncStorage.setItem('ImageList', JSON.stringify(images));
  AsyncStorage.setItem('ImageCount', JSON.stringify(imageCount));
};

export const getImagesFromStore = async () => {
  let list = await AsyncStorage.getItem('ImageList');
  //console.log(typeof list);
  const imgs = JSON.parse(list);
  //console.log(imgs);
  return imgs;
};
