import React,{useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet,TextInput,Button,DropDownPicker,ScrollView,ActivityIndicator, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';





const Addd = ({ isVisible, user, onClose, onLogout }) => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('Date');
  const [showCalendar, setShowCalendar] = useState(false);
  const [UserId, setUserId] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItem1, setSelectedItem1] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [mclCode, setMclCode] = useState('');
  const [cAmpHBValue, setCampHBValue] = useState('0');
  const [selectedCity, setSelectedCity] = useState('');

  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [error, setError] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(true);
  
  useEffect(() => {
    fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetStates',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setStateList(data.responseData))
      .catch(error => console.error(error));
  }, []);
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
  const handleSubmit = () => {
    if (!doctorName || !mobile || !dob || !selectedState || !selectedCity || !selectedDate ) {
      Alert.alert('Please fill all the required fields');
      return;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(mobile)) {
      Alert.alert('Please enter a valid mobile number');
      return;
    }

    if (doctorName.length < 3 || doctorName.length > 50) {
      Alert.alert('Please enter a valid doctor name');
      return;
    }
    const dobRegex = /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/;
  if (!dobRegex.test(dob)) {
    Alert.alert('Please enter a valid date of birth (DD-MM-YYYY)');
    return;
  } 
const payload={
  doctorId: 0,
  doctorName:doctorName,
  mobile:mobile,
  dob:dob,
  mclCode:mclCode,
  stateCode:selectedState,
  cityCode:selectedCity,
  state:selectedState,
  city:selectedCity,
  doctorCampDetail: {
    campDate:selectedDate,
    cAmpHBValue:cAmpHBValue
  },
  clientId:"10001",
  deptId:"1",
  userId:UserId
}
console.log("This is adding payload",payload)
    fetch('https://digiapi.netcastservice.co.in/DoctorApi/ManageDoctor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.errorCode === '0') {
       setDoctorName('')
       setMobile('')
       setAddress('')
       setDob('')
       setMclCode('')
       setSelectedCity('')
       setSelectedState('')
       setCampHBValue('')
       setSelectedDate('Date')

       onClose(); 
        Alert.alert(
          "Data Added Successfully",
          "",
          [
            {
              text: "OK",
              onPress: () => {
                 // Call the onClose function here
              },
            },
          ],
          { cancelable: false }
        );
        setError(null);
      } else {
        Alert.alert("Error while adding data")
        setError('Unexpected error occurred. Please try again.');

      }
    })
    .catch((error) => {
     
      setError('Unexpected error occurred. Please try again.');
    });
  };

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
        value={doctorName} onChangeText={setDoctorName}
      />
      <TextInput
        style={styles.input}
        placeholder="Doctor Mobile"
        placeholderTextColor="#000"
        keyboardType="numeric"
        value={mobile}
        onChangeText={text => setMobile(text.slice(0, 10))}
        maxLength={10}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Doctor Address" 
        placeholderTextColor="#000"
        value={address} onChangeText={setAddress}
      
      /> */}
      <TextInput
        style={styles.input}
        placeholder="MCL Code" 
        placeholderTextColor="#000"
        value={mclCode} onChangeText={setMclCode}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Doctor DOB (DD-MM-YYYY)"
        placeholderTextColor="#000"
        value={dob} onChangeText={setDob}
        keyboardType="numeric"
        
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
       
      
      {/* <TextInput
        style={styles.input}
        placeholder="No.of camps"
        placeholderTextColor="#000"
      /> */}
   
       
     
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
    <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Hb camp Value</Text>
        </TouchableOpacity>
    <TextInput
        style={styles.input}
        placeholder="Hb camp Value"
        placeholderTextColor="#000"
        value={cAmpHBValue}
        onChangeText={setCampHBValue}
        keyboardType="numeric"
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
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderWidth: 1,
    borderColor: '#d4d4d2',
   marginBottom:10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: 'white',
    width:'100%'
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
  dropd:{
zIndex:100,
height:20,
    marginBottom:10,
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
    marginTop:20,
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

export default Addd;
