import React ,{useState,useEffect}from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UserProfile =  ({ isVisible, user, onClose, onLogout,route, }) => {
  const [fullName, setFullName] = useState('');
  const [Des, setDes] = useState('');
    const [data, setData] = useState(null);
    const navigation = useNavigation();
    // try {
    //   const jsonData = await AsyncStorage.getItem('key');
    //   const data = JSON.parse(jsonData);
    //   console.log('Data retrieved successfully:', data);
    // } catch (error) {
    //   console.log('Error retrieving data:', error);
    // }

    // useEffect(() => {
    //   const getData = async () => {
    //     try {
    //       const jsonData = await AsyncStorage.getItem('key');
    //       const data = JSON.parse(jsonData);
    //       setData(data.fullName);
    //       console.log("New---------------------------------------------------------");
    //       console.log(data.fullName);
    //     } catch (error) {
    //       console.log('Error retrieving data:', error);
    //     }
    //   };
    //   getData();
    // }, []);
    useEffect(() => {
      const getData = async () => {
        try {
          const jsonData = await AsyncStorage.getItem('key');
          if (jsonData !== null) {
            const data = JSON.parse(jsonData);
            setFullName(data.responseData.fullName);
            setDes(data.responseData.designation);
          }
        } catch (error) {
          console.log('Error retrieving data:', error);
        }
      };
      getData();
    }, []);
  
      // useEffect(() => {
      //   AsyncStorage.getItem('user').then((value) => {
      //     if (value !== null) {
      //       console.log(value)
      //       setUsername(value);
      //     }
      //   });
        
      // }, []);
      // useEffect(() => {
      //   AsyncStorage.getItem('user').then(data => {
      //     setUsername(JSON.parse(data));
      //   });
      // }, []);


      const handleLogout = async () => {
        await AsyncStorage.removeItem('user');
        navigation.navigate('Login'); // replace 'Login' with the name of the screen you want to navigate to
      }
      

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userDetail}>{Des}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutButtonText} onPress={handleLogout}>Logout</Text>
          </TouchableOpacity>
        
          <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userDetail: {
    fontSize: 16,
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // closeButton: {
  //   backgroundColor: 'blue',
  //   padding: 12,
  //   borderRadius: 8,
  //   alignItems: 'center',
  // },
  // closeButtonText: {
  //   color: 'white',
  //   fontWeight: 'bold',
  // },
});

export default UserProfile;
