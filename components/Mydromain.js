import React,{ useEffect,useState } from 'react';
import { Text, View, Button,Image,Alert, FlatList, StyleSheet, ScrollView,TextInput, TouchableOpacity,Modal,ActivityIndicator  } from 'react-native';
import { Footer } from './Footer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { HB } from './Hb';
import Addmydro from './Addmydro';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mydro from './Mydro';
import EditMydro from './EditMydro';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';



export const Mydromain = ({ onChangeText, onPress,data,isVisible  }) =>{
    const [UserId, setUserId] = useState('');
    const [searchText, setSearchText] = useState('');
     const [mydro, setMydro] = useState([]);
     const [mydroDetail, setMydroDetail] = useState(null);
     const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
     const [selectedMydroData, setSelectedMydroData] = useState(undefined);
     const [isEditMydroModalVisible, setIsEditMydroModalVisible] = useState(false);
     const [isLoading, setIsLoading] = useState(true);
     

  // const handleEditMydroPress = (mydrodata) => {
  //   setIsEditMydroModalVisible(!isEditMydroModalVisible);
  //   setSelectedMydroData(mydrodata);
  // };

     const handleCloseModal = () => {
      // Handle logout logic here
      setIsProfileModalVisible(false);
    };
    const handleEditMydro = () => {
      // Handle logout logic here
      setIsEditMydroModalVisible(false);
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
    setIsLoading(true);
    const fetchData = () => {
    fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetDydrosListSearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        searchText:searchText,
        clientId: "10001",
        deptId: "1",
        userId: UserId
      }
      )
    })
    .then(response => response.json())
    .then(data => setMydro(data.responseData))
    .catch(error => console.error(error))
    setIsLoading(false);
  };

  const interval = setInterval(fetchData, 500); // Run the fetchData function every 1 second
  
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [UserId, searchText]);
  const handleMoreInfo = async(mydro) => {

    // setDocId(doctor.patientId);
  
    try {
      const Pid =mydro.dyId
      const jsonData = JSON.stringify(Pid);
      console.log(jsonData)
      await AsyncStorage.setItem('mydroId',jsonData );
      const payload ={
        dyId:jsonData,
       userId: UserId
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
          setIsProfileModalVisible(!isProfileModalVisible);
      console.log('patientId saved successfully');
     
    } catch (error) {
      console.log('Error saving data:', error);
    }
  }

  const UpdateMydro =(data)=>{
    setIsEditMydroModalVisible(true)
    setSelectedMydroData(data)
  }

  const renderModal = (onClose) => {
    if (mydroDetail) {
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
        <Text style={styles.text}>{mydroDetail.doctorName}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Dr MCl Code :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{mydroDetail.mclCode}</Text>
      </View>
    </View>
    
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>POB in Strips :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{mydroDetail.pobStrip}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Prescription Quantity :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{mydroDetail.presQuantity}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Date :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{mydroDetail.dydroDate}</Text>
      </View>
    </View>
    
   
           
            
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
      <View><Mydro/></View>
     
      <View>
      <View style={styles.containermain}>
      <View style={styles.row}>
        <Text style={styles.columnHeader}>Doctor Name</Text>
        <Text style={styles.columnHeader}>Mcl Code</Text>
        <Text style={styles.columnHeader}>Action</Text>
      </View>
      {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#7a057a"/>
        </View>
          ) : (
        <FlatList
        data={mydro}
        keyExtractor={item => item.dyId}
        ListEmptyComponent={() => (
          <Text style={styles.noDataMsg}>No data available</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
          <Text style={styles.name}>{item.doctorName}</Text>
          <Text style={styles.mobile}>{item.mclCode}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleMoreInfo(item)}>
          <Icon name="info" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={()=>UpdateMydro(item)}>
          <Icon name="edit" size={20} color="white" />
          </TouchableOpacity>
          
        </View>
        )}
      />
      )}
      </View>
      {renderModal()}
      <Modal visible={isEditMydroModalVisible} animationType="slide" transparent>
      <UserEditModal setIsEditMydroModalVisible={setIsEditMydroModalVisible} selectedMydroData={selectedMydroData}/>
    </Modal>
      </View>
      </View>
    );
  }


  const UserEditModal =(props)=>{
    const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [dyid, setDyId] = useState('')
  const [empid, setEmpId] = useState('');
   const [UserId, setUserId] = useState('');
  const [empName, setEmpName] = useState('');
  const [hq, setHq] = useState('');
  const [pob, setPob] = useState('');
  const [pqua, setPqua] = useState('');
  const [mclCode, setMclCode] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('--Select Doctor--');

  const handleValueChange = (itemValue, itemIndex) => {
    setSelectedState(itemValue);
    const selectedItem = stateList.find((state) => state.dydroDoctorId === itemValue);
    setSelectedLabel(selectedItem ? selectedItem.doctorName : '--Select Doctor--');
  };

  useEffect(() => {
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
    if(props.selectedMydroData){
      setDyId(props.selectedMydroData.dyId)
      setEmpId(props.selectedMydroData.employeeId)
      setEmpName(props.selectedMydroData.employeeName)
      setHq(props.selectedMydroData.hq)
      setPob(props.selectedMydroData.pobStrip)
      setPqua(props.selectedMydroData.presQuantity)
      setMclCode(props.selectedMydroData.mclCode)
      setSelectedState(props.selectedMydroData.dydroDoctorId)
      setSelectedLabel(props.selectedMydroData.doctorName)
      setSelectedDate(props.selectedMydroData.dydroDate)
    }
  
  },[props.selectedMydroData])

  const EditMydro = async(doctor) => {
    // console.log("F data",jsonData)
    const payload ={
      dyId: dyid,
      dydroDoctorId: selectedState.toString(),
      pobStrip: pob,
      presQuantity: pqua,
      dydroDate:selectedDate,
      clientId: "10001",
      deptId: "1",
      userId: UserId

    }
    console.log(payload)
   
    
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
      props.setIsEditMydroModalVisible(false)
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
        
     
    
      <View style={styles.pickcontainer}>
       <Picker
        selectedValue={selectedState}
        onValueChange={handleValueChange}
        style={styles.picker}
      >
      <Picker.Item label="--Select Doctor--" value="" />
        {stateList.map(state => (
          <Picker.Item key={state.dydroDoctorId} label={state.doctorName} value={state.dydroDoctorId} />
        ))}
      </Picker>
       </View>
       
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
       <TextInput
        style={styles.input}
        placeholder="POB in Strips "
        placeholderTextColor="#000"
        value={pob} 
        onChangeText={(text)=>setPob(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Prescription Quantity"
        placeholderTextColor="#000"
        value={pqua} 
        onChangeText={(text)=>setPqua(text)}
      />
    
    
    <TouchableOpacity style={styles.submitButton} onPress={EditMydro}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
     
     
      </View>
      </ScrollView> 
     
      
          <TouchableOpacity
              style={styles.closeButton}
           onPress={()=>props.setIsEditMydroModalVisible(false)}  
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
    noDataMsg:{
alignContent:'center',
alignItems:'center',
fontSize:20,
fontWeight:'600',
padding:20,
textAlign:'center'
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
    containermain: {
      height:550,
      
    
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

  });
