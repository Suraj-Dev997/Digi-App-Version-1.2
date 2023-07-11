/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet,View,Text} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { SplashScreen } from './components/SplashScreen';
import { Home } from './components/Home';
import { Login } from './components/Login';
import Ham from './components/Ham';
import UserProfile from './components/UserProfile';
import { Calender } from './components/Calender';
import { Revenue } from './components/Revenue';
import { HB } from './components/Hb';
import { BrandSurvey } from './components/BrandSurvey';
import { Mydromain } from './components/Mydromain';

import TTest from './components/TTest';
import { MyScreen } from './components/MyScreen';




const Stack = createNativeStackNavigator();
function App(): JSX.Element {
 

 
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Splash' screenOptions={{
     headerRight:()=><Ham/>,
      headerTintColor:"#fff", headerStyle:{
      backgroundColor:"#7a057a",  
    },
    }}>
       <Stack.Screen name='Home' component={Home} options={{title:"DIGI",headerLeft:()=>
    <View><Text style={styles.dot}>.</Text></View>
    ,
    }} />
        <Stack.Screen
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
    {/* <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} /> */}
   
    <Stack.Screen name='Login' component={Login} options={{title:"User Login",headerShown: false }} />
    <Stack.Screen name='UserProfile' component={UserProfile} />
    <Stack.Screen name='Ham' component={Ham} />
    <Stack.Screen name='Calender' component={Calender} />
    <Stack.Screen name='MyScreen' component={MyScreen} />
    <Stack.Screen name='Revenue' component={Revenue} options={{title:"Revenue Prediction",
    }}/>
    <Stack.Screen name='Mydromain' component={Mydromain} options={{title:"MyDydro Tracking Format",
    }}/>
    <Stack.Screen name='HB' component={HB} options={{title:"Hb Camp Activity ",headerRight:()=><View style={{ flexDirection: 'row' }}><Ham />
    </View>,
    }}/>
    <Stack.Screen name='BrandSurvey' component={BrandSurvey} options={{title:"PRI. SEC. & Brand Survey ",headerRight:()=><View style={{ flexDirection: 'row' }}><Ham />
    </View>,
    }}/>
    </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  dot:{
    color:'#7a057a'
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
