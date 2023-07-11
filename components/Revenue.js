import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet,TouchableOpacity,Text,ImageBackground, } from 'react-native';

const API_URL = 'https://example.com/api';


export const Revenue = (props) =>{
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');

  const handlePress = () => {
    fetch('http://10.0.2.2:8000/api/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        mobile:mobile,
        message:message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        Alert.alert(
            'Message',
            'Thank you for contacting us',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

    return(
        <View style={styles.container}>
          
       <View style={styles.form}>
       <TextInput
        style={styles.input}
        placeholder="Select Month"
        placeholderTextColor="#000"
        value={message}
        onChangeText={(text) => setMessage(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Monthly Revenue"
        placeholderTextColor="#000"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Doctor T-Shirt Size" 
        placeholderTextColor="#000"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Doctor Name"
        placeholderTextColor="#000"
        value={mobile}
        onChangeText={(text) => setMobile(text)}
      />
      {/* <TextInput
       style={styles.messageInput}
       multiline={true}
          numberOfLines={4}
        placeholder="Message"
        placeholderTextColor="#000"
        value={message}
        onChangeText={(text) => setMessage(text)}
      /> */}
      {/* <Button title="Submit" onPress={handlePress} /> */}
      <TouchableOpacity style={styles.submitButton} onPress={handlePress}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
    
 
         
    </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor:'#fff',
      flex: 1,
  
    },
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',

    
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    form: {
      flex: 1,
      padding:20,
      justifyContent: 'center',
    },
    input: {
     
      backgroundColor:'#fff',
      height: 60,
      borderColor: '#d4d4d2',
      borderWidth: 1,
     
      padding: 15,
      marginBottom: 10,
    },
    messageInput: {
      backgroundColor:'#fff',
      height: 120,
      borderColor: '#d4d4d2',
      borderWidth: 1,
     
      padding: 10,
      marginBottom: 20,
      textAlignVertical: 'top',
    },
    submitButton: {
      backgroundColor: '#7a057a',
      padding: 15,
    
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });