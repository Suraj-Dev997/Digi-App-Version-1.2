import React,{ useEffect,useState } from 'react';
import { Text, View, Button,Image, FlatList, StyleSheet, ScrollView,TextInput, TouchableOpacity, Modal,Span,Alert,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddBrandS from './AddBrandS';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';


export const BrandSMain = ({ onChangeText, onPress,data,isVisible  }) =>{
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
  const [isLoading, setIsLoading] = useState(true);

  // const handleEditPatientIconPress = (patientdata) => {
  //   setIsEditPatientModalVisible(!isEditPatientModalVisible);
  //   setSelectedPatientData(patientdata);
  // };

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
    setIsLoading(true);
    const fetchData = () => {
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
    setIsLoading(false);
  };
  const interval = setInterval(fetchData, 500); // Run the fetchData function every 1 second
  
    return () => clearInterval(interval); // Cleanup the interval on component unmount
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

  const UpdateUser =(data)=>{
    setIsEditPatientModalVisible(true)
    setSelectedPatientData(data)
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
        <Text style={styles.textl}>Patient Trimester :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{patientDetail.patientTrimester}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Hb Level :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{patientDetail.hbLevel}</Text>
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
        style={styles.searchinput}
        // onChangeText={setSearchText}
        onChangeText={text => {
          if (text.length >= 3 || text.length === 0) {
            setSearchText(text.length === 0 ? "" : text);
          }
        }}
        placeholder="Search... (Minimum 3 characters)"
      />
      <TouchableOpacity style={styles.button} disabled>
        <Icon name="search" size={20} color="white" />
      </TouchableOpacity>
      
      </View>
      <View><AddBrandS isVisible={isEditPatientModalVisible} getDataDocList={getDataDocList}/></View>
      <View>
      <View style={styles.containermain}>
      <View style={styles.row}>
        <Text style={styles.columnHeader}>Name</Text>
        <Text style={styles.columnHeader}>Mobile</Text>
        <Text style={styles.columnHeader}>Action</Text>
      </View>
      {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#7a057a"/>
        </View>
          ) : (
    <FlatList
        data={doctors}
        keyExtractor={item => item.patientId.toString()}
        ListEmptyComponent={() => (
          <Text style={styles.noDataMsg}>No data available</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
          <Text style={styles.name}>{item.patientName}</Text>
          <Text style={styles.mobile}>{item.mobile}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleMoreInfo(item)}>
          <Icon name="info" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={()=>UpdateUser(item)}>
          <Icon name="edit" size={20} color="white" />
          </TouchableOpacity>
          
        </View>
        )}
      />
      )}
      </View>
  {renderModal()}
  <Modal visible={isEditPatientModalVisible} animationType="slide" transparent>
      <UserEditModal setIsEditPatientModalVisible={setIsEditPatientModalVisible} selectedPatientData={selectedPatientData}/>
    </Modal>
      </View>
      </View>
    );
  }

  const UserEditModal =(props)=>{
    const [selectedDate, setSelectedDate] = useState('Date');
  const [showCalendar, setShowCalendar] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [selectedState, setSelectedState] = useState('');
    const [UserId, setUserId] = useState('');
  const [pId, setPId] = useState('');
  const [pName, setpName] = useState('');
  const [mobile, setMobile] = useState(undefined);
  const [hblevel, setHblevel] = useState('');
  const [patientTrimester, setPatientTrimester] = useState('');
  const [address, setAddress] = useState('');
  const [mclCode, setMclCode] = useState('');
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
      // console.log(stateList)
  }, [UserId, stateList]);
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
  
  useEffect(()=>{
    if(props.selectedPatientData){
      setPId(props.selectedPatientData.patientId)
      setpName(props.selectedPatientData.patientName)
      setMobile(props.selectedPatientData.mobile)
      setPatientTrimester(props.selectedPatientData.patientTrimester)
      setHblevel(props.selectedPatientData.hbLevel)
      setSelectedState(props.selectedPatientData.doctorId)
      setSelectedLabel(props.selectedPatientData.doctorName)
     
      setMclCode(props.selectedPatientData.mclCode)
      setSelectedDate(props.selectedPatientData.patientCampDate)
    }
  
  },[props.selectedPatientData])
  const EditPaitent = async(doctor) => {
    // console.log("F data",jsonData)
    const payload ={
     patientId: pId,
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
     userId: UserId

    }
    console.log(payload)
    console.log(pId)
    console.log(selectedState)
    console.log(selectedLabel)
    console.log(pName)
    console.log(mobile)
    console.log(patientTrimester)
    console.log(hblevel)
    console.log(mclCode)
    console.log(selectedDate)
    console.log(UserId)
    
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
      props.setIsEditPatientModalVisible(false)
       Alert.alert(
         "Data Updated Successfully",
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
    if(stateList){
    return(
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
        keyboardType="numeric"
       
      />
      <TextInput
        style={styles.input}
        placeholder="Patient Trimester"
        placeholderTextColor="#000"
        value={patientTrimester}
        onChangeText={(text)=>setPatientTrimester(text)}
      
       
      />
  
      <TextInput
        style={styles.input}
        placeholder="Hb Level"
        placeholderTextColor="#000"
        value={hblevel}
        onChangeText={(text)=>setHblevel(text)}
      
       
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
    <TouchableOpacity style={styles.submitButton} onPress={EditPaitent}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
     
     
      </View>
      </ScrollView> 
     
      
          <TouchableOpacity
              style={styles.closeButton}
           onPress={()=>props.setIsEditPatientModalVisible(false)}  
         >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
        </View>
      </View>
    )
        }else{
          null
        }
  }
  const styles = StyleSheet.create({
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
    searchinput: {
      flex: 1,
      marginRight: 10,
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
      borderColor: '#d4d4d2',
      borderWidth: 1,
      padding: 15,
       marginBottom: 0,
   },
     input: {
      
       backgroundColor:'#fff',
       height: 50,
       borderColor: '#d4d4d2',
       borderWidth: 1,
      
       padding: 15,
       marginBottom: 10,
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
    noDataMsg:{
      alignContent:'center',
      alignItems:'center',
      fontSize:20,
      fontWeight:'600',
      padding:20,
      textAlign:'center'
          },
  });
