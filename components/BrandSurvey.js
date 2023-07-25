

import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { BrandSMain } from './BrandSMain';

import { Version } from './Version';
import { PriSecMain } from './PriSecMain';
import { Footer } from './Footer';
import {AddPaitent} from './Addpatient';

import { BrandSurveyMain } from './BrandSurveyMain';








const Tab =  createMaterialTopTabNavigator();
export const BrandSurvey = (props) =>{
 

    return(
        <Tab.Navigator options={{
          activeTintColor: 'red', // Specify the desired active tab color
        
        }}>
        <Tab.Screen name='PriSecMain' component={PriSecMain} options={{title:"PRI. SEC.",
}}/>
        <Tab.Screen name='BrandSurveyMain' component={BrandSurveyMain} options={{title:"Brand Survey",
}}/>
        </Tab.Navigator>
        
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 20,
    },
  });
  