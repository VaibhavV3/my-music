import React, { useEffect } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import Pictures from '../screens/Pictures';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import color from '../misc/color';

const Tab = createBottomTabNavigator();

const { width } = Dimensions.get('window').width;
const { height } = Dimensions.get('window').height;
/**
 * @author
 * @function AppNavigator
 **/
const AppNavigator = () => {
  const initialLoginState = {
    isLoading: true,
    userName: '',
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'UserName':
        return {
          ...prevState,
          userName: action.name,
          isLoading: false,
        };
      case 'Loading':
        return {
          ...prevState,
          isLoading: false,
        };
    }
  };

  useEffect(() => {
    setTimeout(async () => {
      dispatch({ type: 'Loading' });
    }, 5000);
  }, []);

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  if (loginState.isLoading) {
    console.log('inside loading');
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'flex-start',
          backgroundColor: color.APPLICATION_BG,
        }}
      >
        {/* <LottieView
          source={require('./../../assets/love-icon-animation.json')}
          autoPlay
          loop
        /> */}
        <LottieView
          source={require('./../../assets/love-icon-animation.json')}
          autoPlay
          loop
          style={{ elevation: 100 }}
          backgroundColor="transperent"
        />
        <LottieView
          source={require('./../../assets/music-note-character.json')}
          autoPlay
          loop
          height={300}
          width={width}
          backgroundColor="transperent"
        />
      </View>
    );
  }

  return (
    <Tab.Navigator
    // tabBarOptions={{
    //   style: {
    //     backgroundColor: color.FIVE,
    //     height: '7%',
    //   },
    //   activeTintColor: color.SECONDARY,
    //   inactiveTintColor: color.APPLICATION_BG,
    //   showLabel: true,
    //   allowFontScaling: true,
    // }}
    >
      <Tab.Screen
        name="AudioList"
        component={AudioList}
        options={{
          tabBarIcon: ({ size }) => (
            <MaterialIcons name="headset" size={size} color={color.SECONDARY} />
          ),
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          tabBarIcon: ({ size }) => (
            <FontAwesome5
              name="compact-disc"
              size={size}
              color={color.SECONDARY}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Pictures"
        component={PlayList}
        options={{
          tabBarIcon: ({ size }) => (
            <Fontisto name="picture" size={size} color={color.SECONDARY} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Pictures}
        options={{
          tabBarIcon: ({ size }) => (
            <MaterialIcons
              name="settings"
              size={size}
              color={color.SECONDARY}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
