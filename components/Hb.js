

import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { PatientI } from './PatientI';
import { Version } from './Version';
import { DoctorI } from './DoctorI';
import { Footer } from './Footer';
import {AddPaitent} from './Addpatient';






const Tab =  createMaterialTopTabNavigator();
export const HB = (props) =>{
 

    return(
        <Tab.Navigator options={{
          activeTintColor: 'red', // Specify the desired active tab color
        
        }}>
        <Tab.Screen name='DoctorI' component={DoctorI} options={{title:"Doctor",
}}/>
        <Tab.Screen name='PatientI' component={PatientI} options={{title:"Patient",
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
  