import React,{useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet,TextInput,Button,DropDownPicker,ScrollView,FlatList,Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';





const EditPatient = ({ isVisible, user, onClose, onLogout,doctor,setSelectedPatientData,selectedPatientData,getDataDocList,isEditPatientModalVisible }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [campDet, setCampDet] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItem1, setSelectedItem1] = useState(null);
  const [patientDetail, setPatientDetail] = useState(null);
  const [DocId, setDocId] = useState('');
  const [isEditDocModalVisible, setIsEditDocModalVisible] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [UserId, setUserId] = useState('');
  const [pId, setPId] = useState('');
  const [pName, setpName] = useState('');
  const [mobile, setMobile] = useState(undefined);
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [mclCode, setMclCode] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('--Select Doctor--');
  const [test, setTest] = useState('Suraj');
  const [isMounted, setIsMounted] = useState(false);
 
  const handleValueChange = (itemValue, itemIndex) => {
    setSelectedState(itemValue);
    const selectedItem = stateList.find((state) => state.doctorId === itemValue);
    setSelectedLabel(selectedItem ? selectedItem.doctorName : '--Select Doctor--');
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
    const handleMoreInfo = async(doctor) => {
     
      try {
        const id=selectedPatientData.patientId
        const jsonData = JSON.stringify(id);
        // console.log("F data",jsonData)
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
      } catch (error) {
        console.log('Error saving data:', error);
      }
     
       
      }
    handleMoreInfo();
  }, [UserId, patientDetail, selectedPatientData]);
 
  
  useEffect(()=>{
    
  // console.log("This data",patientDetail)
    if(patientDetail){
      setPId(patientDetail.patientId)
      setpName(patientDetail.patientName)
      setMobile(patientDetail.mobile)
      setAddress(patientDetail.address)
      setDob(patientDetail.dob)
      setMclCode(patientDetail.mclCode)
      setSelectedState(patientDetail.doctorId)
      setSelectedDate(patientDetail.patientCampDate)
   
    }
  },[patientDetail])



  const EditPaitent = async(doctor) => {
   
   
       // console.log("F data",jsonData)
       const payload ={
      
        patientId: pId,
        doctorId:selectedState,
        doctorName: selectedLabel,
        patientName: pName,
        mobile: mobile,
        emailId: email,
        address: address,
        dob: dob,
        mclCode: mclCode,
        patientCampDate: selectedDate,
        clientId: "10001",
        deptId: "1",
        userId: UserId
  
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
  if (patientDetail) {
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
       value={pName}
       onChangeText={(text)=>setpName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Patient Mobile"
        placeholderTextColor="#000"
        value={mobile}
       onChangeText={(text)=>setMobile(text)}
       
      />
      <TextInput
        style={styles.input}
        placeholder="Patient Address" 
        placeholderTextColor="#000"
        value={address}
        onChangeText={(text)=>setAddress(text)}
      
      />
      <TextInput
        style={styles.input}
        placeholder="Patient DOB (DD-MM-YYYY)"
        placeholderTextColor="#000"
        value={dob}
        onChangeText={(text)=>setDob(text)}
       
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
        placeholder="MCL Code"
        placeholderTextColor="#000"
        value={mclCode}
        onChangeText={(text)=>setMclCode(text)}
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

     
      <TouchableOpacity style={styles.submitButton} onPress={EditPaitent}>
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
  containert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:15,
    justifyContent: 'center',
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
  dropd:{
zIndex:100,
height:20,
    marginBottom:10,
  },
  form1: {
   
     paddingLeft:20,
     paddingRight:20,
     paddingBottom:20,
     backgroundColor:'#fff',
     
   },
  cal:{
    width:'100%',
    justifyContent:'flex-start',
    
        },
  inputcal:{
    backgroundColor:'#fff',
  height: 50,
  width:255,
  borderColor: '#d4d4d2',
  borderWidth: 1, 
  padding: 15,
  marginBottom: -5,
},
  input: {
   
    backgroundColor:'#fff',
    height: 50,
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

export default EditPatient;
