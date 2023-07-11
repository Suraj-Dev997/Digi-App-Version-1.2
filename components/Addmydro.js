import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity,Alert, Modal, StyleSheet,TextInput,ScrollView,TouchableWithoutFeedback  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Addmydro = ({ isVisible, user, onClose, onLogout }) => {
  const [selectedDate, setSelectedDate] = useState('Date');
  const [showCalendar, setShowCalendar] = useState(false);
  const [empid, setpEmpId] = useState('');
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
    const selectedItem = stateList.find((state) => state.dydroDoctorId === itemValue);
    setSelectedLabel(selectedItem ? selectedItem.doctorName : '--Select Doctor--');
  };
  useEffect(() => {
    console.log(selectedState)
    console.log(selectedLabel)

    const fetchData = () => {
    fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetDydroUserDoctorMappingDetail',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },body: JSON.stringify({ 
              
               userId: UserId
             }
             )
    })
      .then(response => response.json())
      .then(data => setStateList(data.responseData))
      .catch(error => console.error(error));
    };

    const interval = setInterval(fetchData, 500); // Run the fetchData function every 1 second
  
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [UserId, selectedLabel, selectedState]);
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
  const AddMydrodata = async(doctor) => {
    if ( !selectedState || !pob || !pqua  ) {
      Alert.alert('Please fill all the required fields');
      return;
    }
   

   
  
   
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
  dyId: 0,
  dydroDoctorId: selectedState.toString(),
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
          setpEmpId('')
          setEmpName('')
          setSelectedState('')
          setSelectedLabel('')
          setMclCode('')
          setHq('')
          setPob('')
          setPqua('')
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
          
       {/* <TextInput
        style={styles.input}
        placeholder="Employee ID"
        placeholderTextColor="#000"
        value={empid} onChangeText={setpEmpId}
        
      />
      <TextInput
        style={styles.input}
        placeholder="Employee Name"
        placeholderTextColor="#000"
        value={empName} onChangeText={setEmpName}
       
      /> */}
       <View style={styles.pickcontainer}>
       <Picker
        selectedValue={selectedState}
        onValueChange={handleValueChange}
        style={styles.picker}
      >
      <Picker.Item label="--Select Doctor--" value="" />
        {/* {stateList.map(state => (
          <Picker.Item key={state.dydroDoctorId} label={state.doctorName} value={state.dydroDoctorId} />
        ))} */}
        {stateList.map(state => {
    try {
      return (
        <Picker.Item key={state.dydroDoctorId} label={state.doctorName} value={state.dydroDoctorId} />
      );
    } catch (error) {
      console.log(`Error rendering picker item for state: ${state}`, error);
      return null; // Or you can render a fallback UI element
    }
  })}
      </Picker>
       </View>
       
      {/* <TextInput
        style={styles.input}
        placeholder="Dr MCL Code"
        placeholderTextColor="#000"
        value={mclCode} onChangeText={setMclCode}
       
      /> */}
      {/* <TextInput
        style={styles.input}
        placeholder="HQ "
        placeholderTextColor="#000"
        value={hq} onChangeText={setHq}
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
      {/* <TouchableOpacity onPress={() => setShowCalendar(true)} activeOpacity={1}>
      <TextInput  
  placeholder="Date"
  value={selectedDate ? selectedDate.toString() : ''}
  style={styles.inputcal}
  
  onEndEditing={() => setShowCalendar(true)}

/>
</TouchableOpacity> */}
    
  
     </View>
    </View>
    <TextInput
        style={styles.input}
        placeholder="POB in Strips "
        placeholderTextColor="#000"
        value={pob} onChangeText={setPob}
      />
       <TextInput
        style={styles.input}
        placeholder="Prescription Quantity"
        placeholderTextColor="#000"
        value={pqua} onChangeText={setPqua}
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
}else {
  // Render a loading state or handle the case when stateList is still loading
  return <Modal visible={isVisible} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <ScrollView>
        <View style={styles.form}>
          <Text style={styles.textmsg}>No doctor data is linked to your account. Please contact the admin. </Text>
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

// if (stateList) {
//   return (
//     <Modal visible={isVisible} animationType="slide" transparent>
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <ScrollView>
//             <View style={styles.form}>
//               <View style={styles.pickcontainer}>
//                 {stateList.length === 0 ? (
//                   <Text>No data available.</Text>
//                 ) : (
//                   <Picker
//                     selectedValue={selectedState}
//                     onValueChange={handleValueChange}
//                     style={styles.picker}
//                   >
//                     <Picker.Item label="--Select Doctor--" value="" />
//                     {stateList.map(state => (
//                       <Picker.Item
//                         key={state.dydroDoctorId}
//                         label={state.doctorName}
//                         value={state.dydroDoctorId}
//                       />
//                     ))}
//                   </Picker>
//                 )}
//               </View>
//               {/* Rest of your form content */}
//             </View>
//           </ScrollView>
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={onClose}
//           >
//             <Text style={styles.closeButtonText}>X</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// } else {
//   // Render a loading state or handle the case when stateList is still loading
//   return <Modal visible={isVisible} animationType="slide" transparent>
//   <View style={styles.modalContainer}>
//     <View style={styles.modalContent}>
//       <ScrollView>
//         <View style={styles.form}>
//           <Text>Hello</Text>
//           {/* Rest of your form content */}
//         </View>
//       </ScrollView>
//       <TouchableOpacity
//         style={styles.closeButton}
//         onPress={onClose}
//       >
//         <Text style={styles.closeButtonText}>X</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// </Modal>;
// }




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

export default Addmydro;
