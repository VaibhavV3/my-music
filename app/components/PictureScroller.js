import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Animated,
  Platform,
} from 'react-native';
import getImages from '../context/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SPACING = 10;
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.6;

const Loading = () => {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.paragraph}>Loading...</Text>
    </View>
  );
};

const Backdrop = ({ images, scrollX }) => {
  return (
    <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }}>
      <FlatList
        data={images.reverse()}
        keyExtractor={(item) => item.key + '-backdrop'}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.backdrop) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
            outputRange: [0, width],
            // extrapolate:'clamp'
          });
          return (
            <Animated.View
              removeClippedSubviews={false}
              style={{
                position: 'absolute',
                width: translateX,
                height,
                overflow: 'hidden',
              }}
            >
              <Image
                source={item.path}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  position: 'absolute',
                }}
              />
            </Animated.View>
          );
        }}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'white']}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: 'absolute',
          bottom: 0,
        }}
      />
    </View>
  );
};

class PictureScroller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      scrollX: new Animated.Value(0),
    };
  }

  componentDidMount() {
    if (this.state.images.length === 0) {
      const images = getImages();

      this.setState({
        images: [{ key: 'empty-left' }, ...images, { key: 'empty-right' }],
      });
    }
  }

  render() {
    //const images = getImages();
    //const scrollX = this.myRef; //React.useRef(new Animated.Value(0)).current;
    const images = this.state.images;
    if (images.length === 0) {
      return <Loading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        {/* <Backdrop images={images} scrollX={scrollX} /> */}
        <Animated.FlatList
          showsHorizontalScrollIndicator={false}
          data={images}
          keyExtractor={(item) => item.key}
          horizontal
          contentContainerStyle={{
            alignItems: 'center',
          }}
          snapToInterval={ITEM_SIZE}
          decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: this.state.scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => {
            if (!item.path) {
              return <View style={{ width: SPACER_ITEM_SIZE }} />;
            }
            const inputRange = [
              (index - 1) * ITEM_SIZE,
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
            ];
            let translateY = this.state.scrollX.interpolate({
              inputRange,
              outputRange: [100, 50, 100],
              extrapolate: 'clamp',
            });
            return (
              <View style={{ width: ITEM_SIZE }}>
                <Animated.View
                  style={{
                    marginHorizontal: SPACING,
                    padding: SPACING * 2,
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    borderRadius: 34,
                    transform: [{ translateY }],
                  }}
                >
                  <Image source={item.path} style={styles.posterImages} />
                  <Text style={{ fontSize: 24 }}> Name </Text>
                  <Text style={{ fontSize: 12 }} numberOfLines={3}>
                    Caption here
                  </Text>
                </Animated.View>
              </View>
            );
          }}
        ></Animated.FlatList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImages: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});

export default PictureScroller;
