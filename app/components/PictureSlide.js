import React, { useEffect } from 'react';
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
import color from '../misc/color';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SPACING = 10;
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.7;

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
          if (!item.path) {
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
                source={{ uri: item.path }}
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
        colors={['rgba(0, 0, 0, 0)', color.APPLICATION_BG]}
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

/**
 * @author
 * @function Pictures
 **/
const PictureSlide = (props) => {
  const [state, setState] = React.useState({
    images: [],
    scrolling: true,
    scrollViewRef: React.createRef(),
  });
  let currentPosition = 0;
  //const [currentPosition, setCurrentPosition] = React.useState(0);
  let activeInterval = null;

  React.useEffect(() => {
    async function getData() {
      const img = await getImages();
      if (img.length > state.images.length - 2) {
        setState((state) => {
          return {
            ...state,
            images: [{ key: 'empty-left' }, ...img, { key: 'empty-right' }],
          };
        });
      }
    }
    getData();

    return () => clearScrolling();
  }, []);

  useEffect(() => {
    //console.log(state.images.length);
    if (state.images.length !== 0) {
      //console.log(activeInterval);
      clearScrolling();
      startScroll();
    }
  }, [state.images]);

  // if (state.images.length === 0) {
  //   const img = getImages();
  //   setState((state) => {
  //     return {
  //       ...state,
  //       images: [{ key: 'empty-left' }, ...img, { key: 'empty-right' }],
  //     };
  //   });
  // }
  const startScroll = () => {
    console.log('Start of Scrolling');
    activeInterval = setInterval(scrolling, 5000);
  };

  const scrolling = () => {
    let position = currentPosition + ITEM_SIZE;
    const maxOffset = (state.images.length - 3) * ITEM_SIZE;
    if (position > maxOffset) {
      position = 0;
    }
    currentPosition = position;
    //console.log(currentPosition + ' / ' + maxOffset);
    if (state.scrollViewRef === null || state.scrollViewRef.current === null) {
      return;
    }
    state.scrollViewRef.current.scrollToOffset({
      offset: position,
      animated: true,
    });
  };

  const clearScrolling = () => {
    if (activeInterval) {
      clearInterval(activeInterval);
      activeInterval = null;
      console.log('scrolling cleared');
    }
  };

  const onTouchBegin = () => {
    //console.log(2);
    clearScrolling();
  };

  const onTouchEnd = () => {
    console.log(3);
    if (!state.scrolling) {
      startScroll();
    }
  };

  const onScrollBegin = () => {
    console.log(1);
    setState({ ...state, scrolling: true });
    clearScrolling();
  };

  const onScrollEnd = (event) => {
    console.log(4);
    setState({
      ...state,
      scrolling: false,
    });
    let newPos = event.nativeEvent.contentOffset.x;
    currentPosition = Math.ceil(newPos / ITEM_SIZE) * ITEM_SIZE;
    startScroll();
  };

  const scrollX = React.useRef(new Animated.Value(0)).current;

  if (state.images.length === 0) {
    return <Loading />;
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Backdrop images={state.images} scrollX={scrollX} />
      <Animated.FlatList
        ref={state.scrollViewRef}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        data={state.images}
        keyExtractor={(item) => item.key}
        horizontal
        contentContainerStyle={{
          alignItems: 'center',
        }}
        snapToInterval={ITEM_SIZE}
        decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.path) {
            return <View style={{ width: SPACER_ITEM_SIZE }} />;
          }
          //console.log(index);
          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [180, 130, 180],
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
                <Image
                  source={{ uri: item.path }}
                  style={styles.posterImages}
                />
                {/* <Text style={{ fontSize: 24 }}> Name </Text> */}
                <Text style={styles.captionStyle} numberOfLines={3}>
                  {item.caption}
                </Text>
              </Animated.View>
            </View>
          );
        }}
      ></Animated.FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.APPLICATION_BG,
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
  captionStyle: {
    fontSize: 15,
    color: color.FIVE,
  },
});
export default PictureSlide;
