import React,{ useEffect,useState } from 'react';
import { Text, View, Button,Image, FlatList, StyleSheet, ScrollView,TextInput, TouchableOpacity, Modal,Span } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddPaitent from './AddPaitent';
import EditPatient from './EditPatient';


export const PatientI = ({ onChangeText, onPress,data,isVisible  }) =>{
  const [doctors, setDoctors] = useState([]);
  const [UserId, setUserId] = useState('');
  const [DocId, setDocId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatientData, setSelectedPatientData] = useState(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const [patientDetail, setPatientDetail] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isEditPatientModalVisible, setIsEditPatientModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleEditPatientIconPress = (patientdata) => {
    setIsEditPatientModalVisible(!isEditPatientModalVisible);
    setSelectedPatientData(patientdata);
  };

  const handleEditDoc = () => {
    // Handle logout logic here
    setIsEditPatientModalVisible(false);
  };

  const handleCloseModal = () => {
    // Handle logout logic here
    setIsProfileModalVisible(false);
  };
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

  const getDataDocList =()=>{
    fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetPatientsList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      clientId: "10001",
      deptId: "1",
      userId: UserId
    }
    )
  })
  .then(response => response.json())
  .then(data => setDoctors(data.responseData))
  .catch(error => console.error(error))
  }
  useEffect(() => {
 
      fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetPatientsListSearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        searchText: searchText,
        clientId: "10001",
        deptId: "1",
        userId: UserId
      }
      )
    })
    .then(response => response.json())
    .then(data => setDoctors(data.responseData))
    .catch(error => console.error(error))
  
  
  }, [UserId, searchText]);

  const handleMoreInfo = async(doctor) => {
    setSelectedDoctor(doctor);
    // setDocId(doctor.patientId);
  
    try {
      const Pid =doctor.patientId
      const jsonData = JSON.stringify(Pid);
      
      await AsyncStorage.setItem('patientId',jsonData );
      const payload ={
        patientId:jsonData,
        "clientId": "10001",
       "deptId": "1",
       "userId": UserId
      }
          fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetPatientDetail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
          .then(response => response.json())
          .then(data => setPatientDetail(data.responseData))
          .catch(error => console.error(error))
          setIsProfileModalVisible(!isProfileModalVisible);
      console.log('patientId saved successfully');
    } catch (error) {
      console.log('Error saving data:', error);
    }
   

  }
 
  const renderModal = (onClose) => {
    if (patientDetail) {
     
      return (
        <Modal visible={isProfileModalVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <View style={styles.innerstyle}>
        <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Patient Name :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{patientDetail.patientName}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Patient Mobile :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{patientDetail.mobile}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Patient Email :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{patientDetail.emailId}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Patient Address :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{patientDetail.address}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Patient DOB :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{patientDetail.dob}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Doctor Name :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{patientDetail.doctorName}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>MCL Code :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{patientDetail.mclCode}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Date :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{patientDetail.patientCampDate}</Text>
      </View>
    </View>
            {/* {patientDetail.doctorCampList && (
              <FlatList
                data={patientDetail.doctorCampList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <View style={styles.row1}>
      <View style={styles.column}>
        <Text style={styles.textl}>Camp Name :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{item.campName}</Text>
      </View>
    </View> 
   </View>
                )}
              />
            )} */}
            
          </View>
          <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
        
      );
    } else {
      return null;
    }
  }
 
    return(
      <View>
      
        <View style={styles.container}>
            <TextInput
        style={styles.input}
        onChangeText={setSearchText}
        placeholder="Search..."
      />
      <TouchableOpacity style={styles.button} >
        <Icon name="search" size={20} color="white" />
      </TouchableOpacity>
      
      </View>
      <View><AddPaitent isVisible={isEditPatientModalVisible} getDataDocList={getDataDocList}/></View>
      <View>
      <View style={styles.containermain}>
      <View style={styles.row}>
        <Text style={styles.columnHeader}>Name</Text>
        <Text style={styles.columnHeader}>Mobile</Text>
        <Text style={styles.columnHeader}>Action</Text>
      </View>
    <FlatList
        data={doctors}
        keyExtractor={item => item.patientId.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
          <Text style={styles.name}>{item.patientName}</Text>
          <Text style={styles.mobile}>{item.mobile}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleMoreInfo(item)}>
          <Icon name="info" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={()=>handleEditPatientIconPress(item)}>
          <Icon name="edit" size={20} color="white" />
          </TouchableOpacity>
          
        </View>
        )}
      />
      </View>
  {renderModal()}
  <EditPatient
        isVisible={isEditPatientModalVisible}
        onClose={handleEditPatientIconPress}
        onLogout={handleEditDoc}
        selectedPatientData={selectedPatientData}
        setSelectedPatientData={setSelectedPatientData}
        getDataDocList={getDataDocList}
      />
      </View>
      </View>
    );
  }
  const styles = StyleSheet.create({
    // row: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   paddingVertical: 10,
    // },
    innerstyle:{
      marginTop:30,
      marginBottom:30,
      padding:5,
    },
    containermain: {
      height:550,
      
    
    },
    column: {
      flex: 1,
    },
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
      // borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopColor: '#ccc',
      borderBottomColor: '#ccc',
      paddingVertical: 10,
    },
    row1: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // borderTopWidth: 1,
      // borderBottomWidth: 1,
      // borderTopColor: '#ccc',
      // borderBottomColor: '#ccc',
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
    modalText: {
      fontSize: 18,
      marginBottom: 10
    },
    textl:{
      fontWeight:900,
      
    },
  });
