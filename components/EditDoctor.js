import React,{useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet,TextInput,Button,DropDownPicker,ScrollView,FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';





const EditDoctor = ({ isVisible, user, onClose, onLogout,doctor,setSelectedDoctorData,selectedDoctorData }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [campDet, setCampDet] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItem1, setSelectedItem1] = useState(null);
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [DocId, setDocId] = useState('');
  const [isEditDocModalVisible, setIsEditDocModalVisible] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  const [cAmpHBValue, setCampHBValue] = useState('');


  useEffect(() => {
    // console.log(selectedDoctorData)
    fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetStates',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setStateList(data.responseData))
      .catch(error => console.error(error));
  }, [selectedDoctorData]);
  useEffect(() => {
    if (selectedState) {
      // Fetch the list of cities for the selected state from the API
      fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetCities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: selectedState,
          value: ''
        })
      })
        .then(response => response.json())
        .then(data => setCityList(data.responseData))
        .catch(error => console.error(error));
    } else {
      // Clear the city list when no state is selected
      setCityList([]);
    }
  }, [selectedState]);
  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const jsonData = await AsyncStorage.getItem('DoctorId');
  //       if (jsonData !== null) {
  //         const data = JSON.parse(jsonData);
  //         setDocId(data);
  //         console.log(data)
  //       }
  //     } catch (error) {
  //       console.log('Error retrieving data:', error);
  //     }
  //   };
  //   getData();
  // }, []);
  
  useEffect(() => {
    const handleMoreInfo = async(doctor) => {
        setSelectedDoctor(doctor);
        try {
          const jsonData = JSON.stringify(selectedDoctorData.doctorId);
          const payload ={
            doctorId:jsonData
          }
          fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetDoctorDetail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
          .then(response => response.json())
          .then(data => setDoctorDetail(data.responseData))
          .catch(error => console.error(error))
        } catch (error) {
          console.log('Error saving data:', error);
        }
       
     
       
      }
    handleMoreInfo();
  }, [DocId, selectedDoctorData]);

  useEffect(()=>{
    console.log(doctorDetail)
    if(doctorDetail){
      setDoctorName(doctorDetail.doctorName)
      setMobile(doctorDetail.mobile)
      setAddress(doctorDetail.address)
      setDob(doctorDetail.dob)
      setSelectedState(doctorDetail.state)
      setSelectedCity(doctorDetail.city)
      setSelectedDate(doctorDetail.doctorCampList.campDate)
      setCampHBValue(doctorDetail.cAmpHBValue)
    }

  },[doctorDetail])

  if (doctorDetail) {
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <ScrollView>
        <View style={styles.form}>
        
          <TextInput
        style={styles.input}
        placeholder="Doctor Name"
        placeholderTextColor="#000"
        value={doctorName}
        
      />
      <TextInput
        style={styles.input}
        placeholder="Doctor Mobile"
        placeholderTextColor="#000"
        value={mobile}
       
      />
      <TextInput
        style={styles.input}
        placeholder="Doctor Address" 
        placeholderTextColor="#000"
        value={address}
      
      />
      
      <TextInput
        style={styles.input}
        placeholder="Doctor DOB (DD-MM-YYYY)"
        placeholderTextColor="#000"
        value={dob}
       
      />
      <View style={styles.pickcontainer}>
       <Picker
        selectedValue={selectedState}
        onValueChange={(itemValue, itemIndex) => setSelectedState(itemValue)}
        style={styles.picker}
      >
      <Picker.Item label="--Select State--" value="" />
        {stateList.map(state => (
          <Picker.Item key={state.key} label={state.value} value={state.key} />
        ))}
      </Picker>
       </View>

       {cityList && cityList.length > 0 && (
        <React.Fragment>
         <View style={styles.pickcontainer}>
         <Picker
            selectedValue={selectedCity}
            onValueChange={(itemValue, itemIndex) => setSelectedCity(itemValue)}
          >
            <Picker.Item label="--Select City--" value="" />
            {cityList.map(city => (
              <Picker.Item key={city.key} label={city.value} value={city.key} />
            ))}
          </Picker>
         </View>
        </React.Fragment>
      )}
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
       <TextInput
        style={styles.input}
        placeholder="Hb camp Value"
        placeholderTextColor="#000"
      value={cAmpHBValue}
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
      
      </View>
      </ScrollView>
     
      <TouchableOpacity style={styles.submitButton} >
          <Text style={styles.submitButtonText}>SUBMIT</Text>
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

export default EditDoctor;
