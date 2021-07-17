import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  TextInput,
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

const { width } = Dimensions.get('window');

const Pictures = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');

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
    if (result.cancelled) {
      setImage(null);
    } else {
      setImage(result);
    }
  };

  const addImage = async () => {
    console.log(caption);
    if (image === null) return;

    try {
      const asset = await MediaLibrary.createAssetAsync(image.uri);
      const album = await MediaLibrary.getAlbumAsync('my-music');

      if (album == null) {
        await MediaLibrary.createAlbumAsync('my-music', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      var arr = asset.uri.split('/');
      const fileName = arr[arr.length - 1];
      const filePath =
        'file:///storage/emulated/0/Pictures/my-music/' + fileName;

      addImageToList(filePath, fileName, caption);
      setCaption('');
      setImage(null);
      alert('Image Added Successfully !');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Screen style={{ flex: 1 }}>
      <View style={styles.buttonContainer}>
        <Pressable onPress={pickImage} style={styles.button}>
          <Text style={styles.text}>Choose Image</Text>
        </Pressable>
      </View>
      <View style={styles.captionLabel}>
        <Text style={styles.label}>Enter Caption (Optional): </Text>
      </View>
      <TextInput
        value={caption}
        style={styles.input}
        onChangeText={(value) => setCaption(value)}
        multiline={true}
      />
      <View style={styles.buttonContainer}>
        <Pressable onPress={addImage} style={styles.button}>
          <Text style={styles.text}>Submit Image</Text>
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
  buttonContainer: {
    padding: 25,
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    elevation: 3,
    backgroundColor: color.SECONDARY,
    width: width - 140,
    paddingVertical: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: color.FIVE,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: color.FIVE,
    alignSelf: 'center',
    width: width - 80,
    height: 200,
    backgroundColor: color.FIVE,
    borderRadius: 34,
    color: color.BUTTONS,
    fontSize: 18,
    padding: 5,
  },
  captionLabel: {
    padding: 20,
    alignSelf: 'center',
    width: width - 40,
  },
  label: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: color.FIVE,
    alignSelf: 'flex-start',
  },
});
export default Pictures;
