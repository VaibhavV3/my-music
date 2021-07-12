import React, { useState, useEffect } from 'react';
import {
  Button,
  Image,
  View,
  Platform,
  StyleSheet,
  Pressable,
  Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import Screen from '../components/Screen';
import { addImageToList } from '../misc/helper';
import color from '../misc/color';

const Pictures = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync(true);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });
    if (result.cancelled) return;
    //console.log(result);
    //const fileSplits = result.uri.split('/');
    //const fileName = fileSplits[fileSplits.length - 1];
    //console.log(fileName);

    try {
      const asset = await MediaLibrary.createAssetAsync(result.uri);
      const album = await MediaLibrary.getAlbumAsync('my-music');
      //console.log(asset);
      //console.log(album);
      if (album == null) {
        await MediaLibrary.createAlbumAsync('my-music', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      //console.log(asset.uri);
      var arr = asset.uri.split('/');
      const fileName =
        'file:///storage/emulated/0/Pictures/my-music/' + arr[arr.length - 1];
      //console.log(fileName);
      addImageToList(fileName);
    } catch (e) {
      console.log(e);
    }

    //saveImage(result.base64, fileName);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <Screen style={{ flex: 1 }}>
      <View style={styles.uploadContainer}>
        <Pressable onPress={pickImage} style={styles.button}>
          <Text style={styles.text}>Add Image</Text>
        </Pressable>
      </View>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContainer: {
    height: 100,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 3,
    backgroundColor: color.SECONDARY,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: color.FIVE,
  },
});
export default Pictures;
