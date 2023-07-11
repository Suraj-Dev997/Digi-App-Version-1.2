import React,{ useEffect,useState } from 'react';
import { Text, View, Button,Image, FlatList, StyleSheet, ScrollView,TextInput, TouchableOpacity, Modal,Span } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddDoctor from './AddDoctor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditDoctor from './EditDoctor';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';


export const DoctorI = ({ onChangeText, onPress,data,isVisible  }) =>{
  
  const [doctors, setDoctors] = useState([]);
  const [UserId, setUserId] = useState('');
  const [DocId, setDocId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDoctorData, setSelectedDoctorData] = useState(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isEditDocModalVisible, setIsEditDocModalVisible] = useState(false);

  const handleEditDocIconPress = (data) => {
    setIsEditDocModalVisible(!isEditDocModalVisible);
    setSelectedDoctorData(data);
  };

  const handleEditDoc = () => {
    // Handle logout logic here
    setIsEditDocModalVisible(false);
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

 
  useEffect(() => {
    fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetDoctorsList', {
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
  }, [UserId]);
  const handleMoreInfo = async(doctor) => {
    setSelectedDoctor(doctor);
    // setDocId(doctor.doctorId);
    
    const jsonData = JSON.stringify(doctor.doctorId);
    try {
      await AsyncStorage.setItem('DoctorId',jsonData );
      console.log('DoctorId saved successfully');
    } catch (error) {
      console.log('Error saving data:', error);
    }
    const did=doctor.doctorId
    console.log("This is",did)

    fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetDoctorDetail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        doctorId:did
      })
    })
    .then(response => response.json())
    .then(data => setDoctorDetail(data.responseData))
    .catch(error => console.error(error))
    setIsProfileModalVisible(!isProfileModalVisible);
  }
  useEffect(() => {
    const getData1 = async () => {
      try {
        const jsonData = await AsyncStorage.getItem('DoctorId');
        if (jsonData !== null) {
          const data = JSON.parse(jsonData);
          setDocId(data);
        }
      } catch (error) {
        console.log('Error retrieving data:', error);
      }
    };
    getData1();
  }, []);
  const renderModal = (onClose) => {
    if (doctorDetail) {
      return (
        <Modal visible={isProfileModalVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <View style={styles.innerstyle}>
        <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Doctor Name :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{doctorDetail.doctorName}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Doctor Mobile :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{doctorDetail.mobile}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Address :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{doctorDetail.address}</Text>
      </View>
    </View>
            {doctorDetail.doctorCampList && (
              <FlatList
                data={doctorDetail.doctorCampList}
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
            )}
            
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
        style={styles.inputsearch}
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
          <TouchableOpacity style={styles.actionButton} onPress={() => handleMoreInfo(item)}>
          <Icon name="info" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={()=>handleEditDocIconPress(item)}>
          <Icon name="edit" size={20} color="white" />
          </TouchableOpacity>
          
        </View>
        )}
      />
  {renderModal()}
  {/* <EditDoctor
        isVisible={isEditDocModalVisible}
        onClose={handleEditDocIconPress}
        onLogout={handleEditDoc}
        selectedDoctorData={selectedDoctorData}
      /> */}
      <Modal visible={isEditDocModalVisible} transparent={true} animationType="slide">
        <UserModel setIsEditDocModalVisible={setIsEditDocModalVisible} selectedDoctorData={selectedDoctorData}/>
      </Modal>
      </View>
      </View>
    );
  }


  const UserModel =(prop)=>{
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedState, setSelectedState] = useState('');
    const [Dname, setDname] = useState(undefined);
    const [Dmobile, setDmobile] = useState('');
    const [Daddress, setDaddress] = useState('');
    const [Ddob, setDdob] = useState('');
    const [Dstate, setDstate] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [Dcampvalue, setDcampvalue] = useState('');
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    
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

    useEffect(()=>{
      if(prop.selectedDoctorData){
        setDname(prop.selectedDoctorData.doctorName)
        setDmobile(prop.selectedDoctorData.mobile)
        setDaddress(prop.selectedDoctorData.address)
        setDdob(prop.selectedDoctorData.dob)
        setSelectedState(prop.selectedDoctorData.state)
        setSelectedCity(prop.selectedDoctorData.city)
       
      }
    },[prop.selectedDoctorData])
 
    return(
    
    <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
    <ScrollView>
    <View style={styles.form}>
    
      <TextInput
    style={styles.input}
    placeholder="Doctor Name"
    placeholderTextColor="#000"
   value={Dname}
    
  />
  <TextInput
    style={styles.input}
    placeholder="Doctor Mobile"
    placeholderTextColor="#000"
    value={Dmobile}
   
   
  />
  <TextInput
    style={styles.input}
    placeholder="Doctor Address" 
    placeholderTextColor="#000"
    value={Daddress}
    
  
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
       
  <TextInput
    style={styles.input}
    placeholder="Doctor DOB"
    placeholderTextColor="#000"

   
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

   <TextInput
    style={styles.input}
    placeholder="Hb camp Value"
    placeholderTextColor="#000"
  
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
          onPress={()=>prop.setIsEditDocModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
    </View>
  </View>
    )
  }
  const styles = StyleSheet.create({
    // row: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   paddingVertical: 10,
    // },
    inputsearch:{
      flex: 1,
      marginRight: 10,
    },
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
    innerstyle:{
      marginTop:30,
      marginBottom:30,
      padding:5,
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
   form: {
    marginTop:2,
     padding:20,
     backgroundColor:'#fff',
     
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
    button: {
      backgroundColor: '#7a057a',
      padding: 10,
      borderRadius: 5,
    },
   
    modalText: {
      fontSize: 18,
      marginBottom: 10
    },
    pickcontainer:{
      borderWidth: 1,
      borderColor: '#d4d4d2',
     
      marginBottom: 10,
     
    },
    textl:{
      fontWeight:900,
      
    },
  });
