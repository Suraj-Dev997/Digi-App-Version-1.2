import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet,TextInput,Button,DropDownPicker,ScrollView,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {DateTimePickerModal} from "react-native-modal-datetime-picker";
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';




const Addp = ({ isVisible, user, onClose, onLogout,isEditPatientModalVisible,getDataDocList }) => {
  const [selectedDate, setSelectedDate] = useState('Date');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDrname, setSelectedDrname] = useState('Dr Name1');
  const [doctorList, setDoctorList] = useState([]);
  const [UserId, setUserId] = useState('');
  const [pName, setpName] = useState('');
  const [mobile, setMobile] = useState('');
  const [hblevel, setHblevel] = useState('');
  const [patientTrimester, setPatientTrimester] = useState('');
  const [mclCode, setMclCode] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [stateList, setStateList] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('--Select Doctor--');
 

  const handleValueChange = (itemValue, itemIndex) => {
    setSelectedState(itemValue);
    const selectedItem = stateList.find((state) => state.doctorId === itemValue);
    setSelectedLabel(selectedItem ? selectedItem.doctorName : '--Select Doctor--');
  };
  useEffect(() => {
    fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetDoctorsList',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },body: JSON.stringify({ 
               clientId: "10001",
               deptId: "1",
               userId: UserId
             }
             )
    })
      .then(response => response.json())
      .then(data => setStateList(data.responseData))
      .catch(error => console.error(error));
  }, [UserId]);
  // useEffect(() => {
  //   // console.log(selectedDoctorData)
  //   fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetDoctorsList',{
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },body: JSON.stringify({ 
  //       clientId: "10001",
  //       deptId: "1",
  //       userId: UserId
  //     }
  //     )
  //   })
  //     .then(response => response.json())
  //     .then(data => setStateList(data.responseData))
  //     .catch(error => console.error(error));
  // }, [UserId]);

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
    const fetchData = () => {
      
    fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetDoctorsList',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },body: JSON.stringify({ 
        clientId: "10001",
        deptId: "1",
        userId: UserId
      }
      )
    })
      .then(response => response.json())
      .then(data => setDoctorList(data))
      .catch(error => console.error(error));
    };
  
    const interval = setInterval(fetchData, 500); // Run the fetchData function every 1 second
  
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [UserId]);
  const AddPaitent = async(doctor) => {
    if (!pName || !mobile || !hblevel || !patientTrimester || !mclCode  || !selectedDate ) {
      Alert.alert('Please fill all the required fields');
      return;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(mobile)) {
      Alert.alert('Please enter a valid mobile number');
      return;
    }

    if (pName.length < 3 || pName.length > 50) {
      Alert.alert('Please enter a valid Patient name');
      return;
    }

   
       // console.log("F data",jsonData)
       const payload ={
      
        patientId: 0,
        doctorId:selectedState,
        doctorName: selectedLabel,
        patientName: pName,
        mobile: mobile,
        patientTrimester: patientTrimester,
        hbLevel: hblevel,
        mclCode: mclCode,
        patientCampDate: selectedDate,
        clientId: "10001",
        deptId: "1",
        userId: UserId,
       }
       fetch('https://digiapi.netcastservice.co.in/DoctorApi/ManagePatient', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(payload)
       })
       .then(response => response.json())
       .then(data => {
        if (data && data.errorCode === '0') {
          setpName('')
          setMobile('')
          setPatientTrimester('')
          setHblevel('')
          setMclCode('')
          setSelectedState('')
          setSelectedDate('Date')

          onClose(); 
        
          Alert.alert(
            "Data Added Successfully",
            "",
            [
              {
                text: "OK",
                onPress: () => {
                  
                // replace "AnotherScreen" with the name of the screen you want to navigate to
                },
              },
            ],
            { cancelable: false }
          );
         
        } else {
          Alert.alert("Error while adding data")
         
  
        }
      })
       .catch(error => console.error(error))
     //  console.log(patientDetail)
   
     }
     if (stateList) {
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <ScrollView>
           
        <View style={styles.form}>
        
        <TextInput
        style={styles.input}
        placeholder="Patient Name"
        placeholderTextColor="#000"
        value={pName} onChangeText={setpName}
        
      />
      <TextInput
        style={styles.input}
        placeholder="Patient Mobile"
        placeholderTextColor="#000"
        value={mobile} 
        onChangeText={text => setMobile(text.slice(0, 10))}
        maxLength={10}
        keyboardType="numeric"
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Patient Mobile"
        placeholderTextColor="#000"
        value={mobile} onChangeText={setMobile}
      /> */}
      <TextInput
        style={styles.input}
        placeholder="Patient Trimester"
        placeholderTextColor="#000"
        value={patientTrimester} onChangeText={setPatientTrimester}
      />
     
      <TextInput
        style={styles.input}
        placeholder="Hb Level"
        placeholderTextColor="#000"
        value={hblevel} onChangeText={setHblevel}
      />
       
      {/* <TextInput
        style={styles.input}
        placeholder="Patient Address" 
        placeholderTextColor="#000"
        value={address} onChangeText={setAddress}
      
      />
      <TextInput
        style={styles.input}
        placeholder="Patient DOB (DD-MM-YYYY)"
        placeholderTextColor="#000"
        value={dob} onChangeText={setDob}
       
      /> */}
        <View style={styles.pickcontainer}>
       <Picker
        selectedValue={selectedState}
        onValueChange={handleValueChange}
        style={styles.picker}
      >
      <Picker.Item label="--Select Doctor--" value="" />
        {stateList.map(state => (
          <Picker.Item key={state.doctorId} label={state.doctorName} value={state.doctorId} />
        ))}
      </Picker>
       </View>
        <TextInput
        style={styles.input}
        placeholder="MCL Code"
        placeholderTextColor="#000"
        value={mclCode} onChangeText={setMclCode}
        keyboardType="numeric"
      />
    
    <View style={styles.containert}>
        <View > 
        <TouchableOpacity style={styles.selectButton} onPress={() => setShowCalendar(true)}>
          <Text style={styles.selectButtonText}>Select Date</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => setShowCalendar(true)}>
      <Text style={styles.buttonText}>{selectedDate ? selectedDate.toString() : ''}</Text>
    </TouchableOpacity>
        {showCalendar && (
        <Calendar
        style={styles.cal}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            setShowCalendar(false);
          }}
        />
      )}
        {/* <TextInput  
  placeholder="Date"
  value={selectedDate ? selectedDate.toString() : ''}
  style={styles.inputcal}
  onPress={() => setShowCalendar(true)}
/> */}
  
     </View>
    </View>

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
      <TouchableOpacity style={styles.submitButton} onPress={AddPaitent}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
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
}else {
  // Render a loading state or handle the case when stateList is still loading
  return <Modal visible={isVisible} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <ScrollView>
        <View style={styles.form}>
          <Text style={styles.textmsg}>Please add Doctor first. </Text>
          {/* Rest of your form content */}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
      >
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>;
}
};

const styles = StyleSheet.create({
  textmsg:{
    fontSize:20,
    fontWeight:'600',
    textAlign:'center',
    padding:10,
  },
  buttonContainer: {
    borderWidth: 1,
    borderColor: '#d4d4d2',
   marginBottom:10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  // containert: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
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
  // input: {
  //   flex: 1,
  //   marginRight: 10,
  // },
  input1: {
    flex: 1,
    marginRight: 0,
  },
  button: {
    backgroundColor: '#7a057a',
    padding: 10,
    borderRadius: 5,
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
   marginTop:2,
    padding:20,
    backgroundColor:'#fff',
    
  },
  pickcontainer:{
    borderWidth: 1,
    borderColor: '#d4d4d2',
   
    marginBottom: 10,
   
  },
  picker:{
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 0,
  },
  input: {
   
    backgroundColor:'#fff',
    height: 50,
    borderColor: '#d4d4d2',
    borderWidth: 1,
   
    padding: 15,
    marginBottom: 10,
  },
  cal:{
    width:'100%',
    justifyContent:'flex-start',
    
        },
  inputcal:{
    backgroundColor:'#fff',
  height: 50,
  width:250,
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
    padding: 10,
  
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectButtonText: {
    color:'#7a057a',
    flex:1,
    borderRadius: 5,
  },
});

export default Addp;
