import { useEffect,useState } from 'react';
import { Text, View, Button,Image, FlatList, StyleSheet, ScrollView,TextInput, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddDoctor from './AddDoctor';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DoctorI = ({ onChangeText, onPress,data  }) =>{
  const [doctors, setDoctors] = useState([]);
  const [UserId, setUserId] = useState('');
  const [Doctordd, setDoctord] = useState([]);
  const [DocName, setDocName] = useState('');
  const [Mobile, setMobile] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    const getData = async () => {
      try {
        const jsonData = await AsyncStorage.getItem('userdata');
        if (jsonData !== null) {
          const data = JSON.parse(jsonData);
          
          setUserId(data.responseData.userId);
         
        }
      } catch (error) {
        console.log('Error retrieving data:', error);
      }
    };
    getData();
  }, []);
 
  useEffect(() => {
   
    fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetDoctorsList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        clientId: "10001",
        deptId: "1",
        userId: "800001"
      }
      )
    })
    .then(response => response.json())
    .then(data => setDoctors(data.responseData))
    .catch(error => console.error(error))
  }, []);
  function DoctorInfo({ doctor, onClose }) {
    return (
      <View>
        <Text>{doctor.doctorName}</Text>
        <Text>{doctor.mobile}</Text>
        <Text>{doctor.address}</Text>
        <Button title="Close" onPress={onClose} />
      </View>
    );
  }
  function DoctorInfoModal({ doctor, onClose }) {
    return (
      <Modal visible={true} animationType="slide">
        <View>
          <Text>{doctor.doctorName}</Text>
          <Text>{doctor.mobile}</Text>
          <Text>{doctor.address}</Text>
          <Text>{doctor.emailId}</Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </Modal>
    );
  }
    return(
      <View>
      
        <View style={styles.container}>
            <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="Search..."
      />
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Icon name="search" size={20} color="white" />
      </TouchableOpacity>
      
      </View>
      <View><AddDoctor/></View>
      <View>
      <View style={styles.row}>
        <Text style={styles.columnHeader}>Name</Text>
        <Text style={styles.columnHeader}>Mobile</Text>
        <Text style={styles.columnHeader}>Action</Text>
      </View>
    <FlatList
        data={doctors}
        keyExtractor={item => item.doctorId.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
          <Text style={styles.name}>{item.doctorName}</Text>
          <Text style={styles.mobile}>{item.mobile}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => { setSelectedDoctor(item); setModalVisible(true); }}>
          <Icon name="info" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
          <Icon name="edit" size={20} color="white" />
          </TouchableOpacity>
          
        </View>
        )}
      />
       {/* {selectedDoctor && <DoctorInfo doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />} */}
       {isModalVisible && <DoctorInfoModal doctor={selectedDoctor} onClose={() => { setModalVisible(false); setSelectedDoctor(null); }} />}
      
      </View>
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopColor: '#ccc',
      borderBottomColor: '#ccc',
      paddingVertical: 10,
    },
    name: {
      textAlign:'center',
      flex: 2,
      marginRight: 10,
    },
    mobile: {
      textAlign:'center',
      flex: 2,
      marginRight: 10,
    },
    actionButton: {
      flex: 1,
      margin:2,
      backgroundColor: '#7a057a',
      paddingVertical: 5,
      paddingHorizontal: 5,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionText: {
      color: 'white',
    },
    columnHeader: {
      textAlign:'center',
      fontWeight: 'bold',
      flex: 2,
      marginRight: 10,
    },
    container1: {
      alignItems: 'center',
      padding: 10,
      // justifyContent: 'center',
      
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    paragraph: {
      fontSize: 15,
      lineHeight: 20,
      marginBottom: 5,
    },
    input: {
      flex: 1,
      marginRight: 10,
    },
    button: {
      backgroundColor: '#7a057a',
      padding: 10,
      borderRadius: 5,
    },
  });
