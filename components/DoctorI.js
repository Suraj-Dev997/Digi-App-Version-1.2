import React, { useEffect,useState } from 'react';
import { Text, View, Button,Image,Alert, FlatList, StyleSheet, ScrollView,TextInput, TouchableOpacity, Modal,Span,ActivityIndicator } from 'react-native';
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
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // const handleEditDocIconPress = (doctordata) => {
  //   setIsEditDocModalVisible(!isEditDocModalVisible);
  //   setSelectedDoctorData(doctordata);
  // };

  // const handleEditDoc = () => {
  //   // Handle logout logic here
  //   setIsEditDocModalVisible(false);
  // };

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

 
  // useEffect(() => {
  //   fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetDoctorsListSearch', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ 
  //       searchText: searchText,
  //       clientId: "10001",
  //       deptId: "1",
  //       userId: UserId
  //     }
  //     )
  //   })
  //   .then(response => response.json())
  //   .then(data => setDoctors(data.responseData))
  //   .catch(error => console.error(error))
  // }, [UserId, searchText]);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetDoctorsListSearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          searchText: searchText,
          clientId: "10001",
          deptId: "1",
          userId: UserId
        })
      })
      .then(response => response.json())
      .then(data => setDoctors(data.responseData))
      .catch(error => console.error(error));
      setIsLoading(false);
    };
  
    const interval = setInterval(fetchData, 500); // Run the fetchData function every 1 second
  
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [UserId, searchText]);

  const handleMoreInfo = async(doctor) => {
    setSelectedDoctor(doctor);
    // setDocId(doctor.doctorId);
   
    try {
      const id=doctor.doctorId
      const jsonData = JSON.stringify(id);
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
          setIsProfileModalVisible(!isProfileModalVisible);
      await AsyncStorage.setItem('DoctorId',jsonData );
      console.log('DoctorId saved successfully',doctorDetail);
    } catch (error) {
      console.log('Error saving data:', error);
    }
  }

  const UpdateDoctor =(data)=>{
    setIsEditDocModalVisible(true)
    setSelectedDoctorData(data)
  }

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
        <Text style={styles.textl}>Mcl Code :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{doctorDetail.mclCode}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Dob :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{doctorDetail.dob}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>State :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{doctorDetail.state}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>City :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{doctorDetail.city}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Number Of Camps :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{doctorDetail.noOfCamp}</Text>
      </View>
    </View>
   
            {/* {doctorDetail.doctorCampList && (
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
    <View style={styles.row1}>
      <View style={styles.column}>
        <Text style={styles.textl}>Camp Date :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{item.campDate}</Text>
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
      <View><AddDoctor/></View>
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
        keyExtractor={item => item.doctorId.toString()}
        ListEmptyComponent={() => (
          <Text style={styles.noDataMsg}>No data available</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
          <Text style={styles.name}>{item.doctorName}</Text>
          <Text style={styles.mobile}>{item.mobile}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleMoreInfo(item)}>
          <Icon name="info" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={()=>UpdateDoctor(item)}>
          <Icon name="edit" size={20} color="white" />
          </TouchableOpacity>
          
        </View>
        )}
      />
      )}
      </View>
  {renderModal()}
 <Modal visible={isEditDocModalVisible} animationType="slide" transparent>
      <UserEditModal setIsEditDocModalVisible={setIsEditDocModalVisible} selectedDoctorData={selectedDoctorData}/>
    </Modal>
      </View>
      </View>
    );
  }

 const UserEditModal =(props)=>{
  const [selectedDate, setSelectedDate] = useState('Date');
  const [showCalendar, setShowCalendar] = useState(false);
  const [UserId, setUserId] = useState('');

  const [selectedState, setSelectedState] = useState('');
  const [selectedStateCode, setSelectedStateCode] = useState('');
  const [docDetail, setDocDetail] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [mclCode, setMclCode] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [cAmpHBValue, setCampHBValue] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCityCode, setSelectedCityCode] = useState('');
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedHBValue, setSelectedHBValue] = useState(null);

  const handleStateChange = (itemValue, itemIndex) => {
    setSelectedStateCode(itemValue);
    console.log(itemValue)
    console.log(selectedStateCode)
    const selectedItem = stateList.find((state) => state.key === itemValue);
    setSelectedState(selectedItem ? selectedItem.value : '--Select State--');
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
  }, []);
  useEffect(() => {
    if (selectedStateCode) {
      // Fetch the list of cities for the selected state from the API
      fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetCities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: selectedStateCode,
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
  }, [selectedState, selectedStateCode]);
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
          const jsonData = JSON.stringify(props.selectedDoctorData.doctorId);
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
  }, [props.selectedDoctorData]);

  useEffect(()=>{
    console.log(doctorDetail)
    if(doctorDetail){
      setDoctorId(doctorDetail.doctorId)
      setDoctorName(doctorDetail.doctorName)
      setMobile(doctorDetail.mobile)
      setAddress(doctorDetail.address)
      setMclCode(doctorDetail.mclCode)
      setDob(doctorDetail.dob)
   
      setSelectedStateCode(doctorDetail.stateCode)
   
      setSelectedCityCode(doctorDetail.cityCode)
      setDocDetail(doctorDetail.doctorCampList)
   console.log("This :",docDetail)
 
  // const campDates = docDetail.map((item) => item.campDate);
  // console.log(campDates);
  
  //  const campDate = docDetail[''].campDate;
  //  console.log(campDate);
      // setCampHBValue(doctorDetail.cAmpHBValue)
    }

  },[docDetail, doctorDetail])


// Ankur Vishnoi



  let markedDay = {};

  docDetail.map((item) => {
    markedDay[item.campDate] = {
      selected: true,
      marked: true,
      selectedColor: "purple",
    };
  });
  // console.log(markedDay)
  // console.log(selectedDate)
  
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
    setCampHBValue("0");
    docDetail.map((item) => {
      // console.log("This is selected Date:", day.dateString)
      if(day.dateString==item.campDate){
        setCampHBValue(item.cAmpHBValue);
        console.log(item.cAmpHBValue);
      }
     
    });

    // const selectedDoc = docDetail.find((doc) => doc.campDate === day.dateString);
    // if (selectedDoc) {
    //   setSelectedHBValue(selectedDoc.cAmpHBValue);
    // } else {
    //   setSelectedHBValue(null);
    // }
  };

  const EditDocFunction = () => {
    const payload ={
      doctorId: doctorId,
        doctorName:doctorName,
        mobile:mobile,
        dob: dob,
        mclCode:mclCode,
        stateCode:selectedStateCode,
        cityCode:selectedCityCode,
        state:selectedStateCode,
        city:selectedCityCode,
        doctorCampDetail: {
          campDate:selectedDate,
          cAmpHBValue:cAmpHBValue,
        },
        clientId:"10001",
        deptId:"1",
        userId:UserId
     }
     console.log("This is payload:",payload)
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
        props.setIsEditDocModalVisible(false)
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
  
    if(stateList){
    return(
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
        placeholder="Doctor Mobile"
        placeholderTextColor="#000"
        keyboardType="numeric"
        value={mobile}
        onChangeText={(text)=>setMobile(text)}
       
       
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Doctor Address" 
        placeholderTextColor="#000"
        value={address} 
        onChangeText={(text)=>setAddress(text)}
      
      /> */}
      <TextInput
        style={styles.input}
        placeholder="MCL Code" 
        placeholderTextColor="#000"
        value={mclCode} 
        onChangeText={(text)=>setMclCode(text)}
        keyboardType="numeric"
      
      />
      <TextInput
        style={styles.input}
        placeholder="Doctor DOB (DD-MM-YYYY)"
        placeholderTextColor="#000"
        value={dob} 
        onChangeText={(text)=>setDob(text)}
      />
      <View style={styles.pickcontainer}>
       <Picker
        selectedValue={selectedStateCode}
        onValueChange={handleStateChange}
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
            selectedValue={selectedCityCode}
            onValueChange={(itemValue, itemIndex) => setSelectedCityCode(itemValue)}
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
        markedDates={markedDay}
  onDayPress={handleDayPress}
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
        keyboardType="numeric"
        onChangeText={(text)=>setCampHBValue(text)}
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
      <TouchableOpacity style={styles.submitButton} onPress={EditDocFunction}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
      </ScrollView> 
     
      
          <TouchableOpacity
              style={styles.closeButton}
           onPress={()=>props.setIsEditDocModalVisible(false)}  
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
    // row: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   paddingVertical: 10,
    // },
    containermain: {
      height:550,
      
    
    },
    containert:{
// marginBottom:20,
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
