import React,{ useEffect,useState } from 'react';
import { Text, View, Button,Image, FlatList, StyleSheet, ScrollView,ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const SplashScreen = ({navigation }) =>{
  useEffect(() => {
    getDeviceToken();
  },[]);
  const getDeviceToken= async () =>{
    let token =await messaging().getToken();
    console.log("token",token);
  }
  // useEffect(() => {
  //   const getDeviceToken = async () => {
  //     try {
  //       const token = await messaging().getToken();
  //       console.log('token', token);
  //     } catch (error) {
  //       console.log('Error getting device token:', error);
  //     }
  //   };
  //   getDeviceToken();
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      handleUser()
    }, 5000);
  });
  

  const handleUser = async()=>{
    const usertoken= await AsyncStorage.getItem("userdata")
    if(!usertoken){
      navigation.replace('Login');
    }else{
      navigation.replace('Home');
    }
  }
  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      // Handle background messages here
      console.log('Received background message:', remoteMessage);
    });

  }, []);

    return(
      <View style={styles.container}>
        <ImageBackground
        source={require('.//images/Splash.jpg')} 
        style={styles.backgroundImage}></ImageBackground>
      {/* <Image
        style={styles.img}
        source={require('.//images/profile.png')}
        resizeMode="contain"
      /> */}
      {/* <Text style={styles.logo}>DIGI</Text> */}
    </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',

    
    },
    logo: {
      fontSize:70,
      fontWeight:'800',
      color: '#7a057a',
    },
    img: {
      width:'100%',
    },
  });
