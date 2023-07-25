import React, { useEffect,useState } from 'react';
import { Text, View, Button,Image,Alert, FlatList, StyleSheet, ScrollView,TextInput, TouchableOpacity, Modal,Span,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditDoctor from './EditDoctor';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import AddBrandSurvey from './AddBrandSurvey';



export const BrandSurveyMain = ({ onChangeText, onPress,data,isVisible  }) =>{
  const [brandSurvey, setBrandSurvey] = useState([]);
  const [UserId, setUserId] = useState('');
  const [DocId, setDocId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDoctorData, setSelectedDoctorData] = useState(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const [brandSurveyDetail, setBrandSurveyDetail] = useState(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isEditDocModalVisible, setIsEditDocModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchData = () => {
      setIsLoading(true);
      fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetBrandSurveyListSearch', {
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
      .then(data => setBrandSurvey(data.responseData))
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
      const id=doctor.brandId
      const jsonData = JSON.stringify(id);
      const payload ={
        brandId:jsonData,
        clientId: "10001",
  deptId: "1",
  userId: UserId
      }
          fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetBrandSurveyDetail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
          .then(response => response.json())
          .then(data => setBrandSurveyDetail(data.responseData))
          .catch(error => console.error(error))
          setIsProfileModalVisible(!isProfileModalVisible);
          console.log(payload);
          console.log(data.responseData);
      await AsyncStorage.setItem('DoctorId',jsonData );
      console.log('PrimarySecondary saved successfully',brandSurveyDetail);
    } catch (error) {
      console.log('Error saving data:', error);
    }
  }

  const UpdateDoctor =(data)=>{
    setIsEditDocModalVisible(true)
    setSelectedDoctorData(data)
  }

  const renderModal = (onClose) => {
    if (brandSurveyDetail) {
     
      return (
        <Modal visible={isProfileModalVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <View style={styles.innerstyle}>
        <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Survey ID :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{brandSurveyDetail.brandId}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Doctor Name:</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{brandSurveyDetail.doctorName}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Mcl Code :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{brandSurveyDetail.mclCode}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Rx Quantity :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{brandSurveyDetail.rx_Quantity}</Text>
      </View>
    </View>
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.textl}>Brand Name :</Text>
      </View>
      <View style={styles.column}>
        <Text style={styles.text}>{brandSurveyDetail.brand}</Text>
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
      <View><AddBrandSurvey/></View>
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
        data={brandSurvey}
        keyExtractor={item => item.brandId.toString()}
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
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [docDetail, setDocDetail] = useState([]);
  const [brandId, setBrandId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [mclCode, setMclCode] = useState('');
  const [rxQuantity, setRxQuantity] = useState('');
  const [brandName, setBrandName] = useState('');



  const [prisecDetail, setPriSecDetail] = useState(null);
  const [stateList, setStateList] = useState([]);
  const [error, setError] = useState(null);




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
        setSelectedDoctor(doctor);
        try {
          const jsonData = JSON.stringify(props.selectedDoctorData.brandId);
          const payload ={
            brandId:jsonData,
            clientId: "10001",
  deptId: "1",
  userId: UserId
          }
          fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetBrandSurveyDetail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          })
          .then(response => response.json())
          .then(data => setPriSecDetail(data.responseData))
          .catch(error => console.error(error))
        } catch (error) {
          console.log('Error saving data:', error);
        }
       
     
       
      }
    handleMoreInfo();
  }, [UserId, props.selectedDoctorData]);



  useEffect(()=>{
    console.log(prisecDetail)
    if(prisecDetail){
      setBrandId(prisecDetail.brandId)
      setDoctorName(prisecDetail.doctorName)
      setMclCode(prisecDetail.mclCode)
      setRxQuantity(prisecDetail.rx_Quantity)
      setBrandName(prisecDetail.brand)
     
   console.log("This :",prisecDetail)
    }

  },[docDetail, prisecDetail])


  const EditDocFunction = () => {
    const payload ={
        brandId: brandId,
        doctorName: doctorName,
        mclCode: mclCode,
        rx_Quantity: rxQuantity,
        brand: brandName,
        clientId:"10001",
        deptId:"1",
        userId:UserId
     }
     console.log("This is payload:",payload)
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
