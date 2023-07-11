import { useState, useEffect } from 'react';
import { View, Text, FlatList,TextInput } from 'react-native';

export default function TTest() {
  const [doctors, setDoctors] = useState([]);
  const [patientDetail, setPatientDetail] = useState(null);
  const [pName, setpName] = useState('');


  useEffect(() => {
    const handleMoreInfo = async(doctor) => {
      
      try {
      
      
        const payload ={
            patientId:"2",
            clientId: "10001",
           deptId: "1",
           userId: "90001"
        }
        fetch('https://digiapi.netcastservice.co.in/DoctorApi/GetPatientDetail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => setPatientDetail(data))
        .catch(error => console.error(error))
      } catch (error) {
        console.log('Error saving data:', error);
      }
     
      //  console.log(patientDetail)
      }
    handleMoreInfo();
  }, []);
  useEffect(()=>{
    
  console.log(patientDetail)
    if(patientDetail){
     
      setpName(patientDetail.errorDetail)
      
   
    }
  },[patientDetail])

  if (patientDetail) {
  return (
    <View>
    <TextInput
      
        placeholder="Patient Name"
        placeholderTextColor="#000"
       value={pName}
       onChangeText={(text)=>setpName(text)}
      />
    </View>
  );
}else{
  return null
}
}
