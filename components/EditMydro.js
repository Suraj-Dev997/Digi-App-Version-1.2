import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity,Alert, Modal, StyleSheet,TextInput,ScrollView,  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditMydro = ({ isVisible, user, onClose, onLogout,selectedMydroData,setSelectedMydroData}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dyid, setDyId] = useState('')
  const [empid, setEmpId] = useState('');
  const [mydroDetail, setMydroDetail] = useState(null);
   const [UserId, setUserId] = useState('');
  const [empName, setEmpName] = useState('');
  const [hq, setHq] = useState('');
  const [pob, setPob] = useState('');
  const [pqua, setPqua] = useState('');
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
    const handleMoreInfo = async(doctor) => {
     
      try {
        const id=selectedMydroData.dyId
        const jsonData = JSON.stringify(id);
        // console.log("F data",jsonData)
        const payload ={
            dyId:jsonData,
            "clientId": "10001",
           "deptId": "1",
           "userId": UserId
        }
        fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetDydroDetail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => setMydroDetail(data.responseData))
        .catch(error => console.error(error))
      } catch (error) {
        console.log('Error saving data:', error);
      }
     
       
      }
    handleMoreInfo();
  }, [UserId, mydroDetail, selectedMydroData]);

  useEffect(()=>{
    
    // console.log("This data",mydroDetail)
      if(mydroDetail){
        setDyId(mydroDetail.dyId)
        setEmpId(mydroDetail.employeeId)
        setEmpName(mydroDetail.employeeName)
        setHq(mydroDetail.hq)
        setPob(mydroDetail.pobStrip)
        setPqua(mydroDetail.presQuantity)
        setMclCode(mydroDetail.mclCode)
        setSelectedState(mydroDetail.doctorId)
        setSelectedDate(mydroDetail.dydroDate)
        
      }
    },[mydroDetail])

  const AddMydrodata = async(doctor) => {
    
  
   
       // console.log("F data",jsonData)
       const payload ={
      
  //       dyId: 0,
  // employeeId: empid,
  // employeeName: empName,
  // doctorId:selectedState,
  // doctorName: selectedLabel,
  // mclCode: mclCode,
  // hq: hq,
  // pobStrip: pob,
  // presQuantity: pqua,
  // dydroDate: "10-05-2023",
  // clientId: "10001",
  // deptId: "1",
  // userId: UserId
  dyId: dyid,
  employeeId: empid,
  employeeName: empName,
  doctorId: selectedState.toString(),
  doctorName: selectedLabel,
  mclCode: mclCode,
  hq: hq,
  pobStrip: pob,
  presQuantity: pqua,
  dydroDate: selectedDate,
  clientId: "10001",
  deptId: "1",
  userId: UserId

       }
      
       fetch('https://digiapi.netcastservice.co.in/DoctorApi/ManageDydro', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(payload)
       })
       .then(response => response.json())
       .then(data => {
        if (data && data.errorCode === '0') {
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
       .catch(error => console.log(error))
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
        placeholder="Employee ID"
        placeholderTextColor="#000"
        value={empid} 
        
      />
      <TextInput
        style={styles.input}
        placeholder="Employee Name"
        placeholderTextColor="#000"
        value={empName} 
       
      />
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
        placeholder="Dr MCL Code"
        placeholderTextColor="#000"
        value={mclCode} 
       
      />
      <TextInput
        style={styles.input}
        placeholder="HQ "
        placeholderTextColor="#000"
        value={hq} 
      />
       <TextInput
        style={styles.input}
        placeholder="POB in Strips "
        placeholderTextColor="#000"
        value={pob} 
      />
       <TextInput
        style={styles.input}
        placeholder="Prescription Quantity"
        placeholderTextColor="#000"
        value={pqua} 
      />
  <View style={styles.containert}>
        <View > 
        <TouchableOpacity style={styles.selectButton} onPress={() => setShowCalendar(true)}>
          <Text style={styles.selectButtonText}>Select Date</Text>
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
        <TextInput  
  placeholder="Date"
  value={selectedDate ? selectedDate.toString() : ''}
  style={styles.inputcal}
  onPress={() => setShowCalendar(true)}
/>
  
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
      <TouchableOpacity style={styles.submitButton} onPress={AddMydrodata}>
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
}else{
  return null
}
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
  input: {
   
    backgroundColor:'#fff',
    height: 50,
    borderColor: '#d4d4d2',
    borderWidth: 1,
   
    padding: 15,
    marginBottom: 10,
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

export default EditMydro;
