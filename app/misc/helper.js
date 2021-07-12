import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAudioForNextOpening = async (audio, index) => {
  AsyncStorage.setItem('previousAudio', JSON.stringify({ audio, index }));
};

export const addImageToList = async (imagePath, imageName, caption) => {
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
  AsyncStorage.setItem(imageName, caption);
};

export const getImagesFromStore = async () => {
  let list = await AsyncStorage.getItem('ImageList');
  //console.log(typeof list);
  const imgs = JSON.parse(list);
  let res = [];
  for (var i = 0; i < imgs.length; i++) {
    var arr = imgs[i]['path'].split('/');
    const fileName = arr[arr.length - 1];
    const caption = await getCaption(fileName);
    const rxt = {
      key: imgs[i]['key'],
      path: imgs[i]['path'],
      caption,
    };
    res.push(rxt);
  }
  return res;
};

export const getCaption = async (fileName) => {
  return await AsyncStorage.getItem(fileName);
};

export const convertTime = (minutes) => {
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
