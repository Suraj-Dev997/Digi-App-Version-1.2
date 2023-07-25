import React,{useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet,TextInput,Button,DropDownPicker,ScrollView,ActivityIndicator, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';





const AddBS = ({ isVisible, user, onClose, onLogout }) => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('Date');
  const [showCalendar, setShowCalendar] = useState(false);
  const [UserId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [mclCode, setMclCode] = useState('');
  const [rxQuantity, setRxQuantity] = useState('');
  const [brandName, setBrandName] = useState('');
  const [error, setError] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(true);
  
 
 
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
    if (!doctorName || !mclCode || !rxQuantity || !brandName ) {
      Alert.alert('Please fill all the required fields');
      return;
    }
    
const payload={
  
    brandId: 0,
        doctorName: doctorName,
        mclCode: mclCode,
        rx_Quantity: rxQuantity,
        brand: brandName,
  clientId:"10001",
  deptId:"1",
  userId:UserId
}
console.log("This is adding payload",payload)
    fetch('https://digiapi.netcastservice.co.in/DoctorApi/ManageBrandSurvey', {
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
       setMclCode('')
       setRxQuantity('')
       setBrandName('')

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
        value={doctorName}
        onChangeText={(text)=>setDoctorName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mcl Code"
        placeholderTextColor="#000"
        value={mclCode}
        onChangeText={(text)=>setMclCode(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Rx Quantity"
        placeholderTextColor="#000"
        value={rxQuantity}
        onChangeText={(text)=>setRxQuantity(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Brand Name"
        placeholderTextColor="#000"
        value={brandName}
        onChangeText={(text)=>setBrandName(text)}
      />

     
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

export default AddBS;
