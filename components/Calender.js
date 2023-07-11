import { useEffect,useState } from 'react';
import { Text, View, Button,Image, FlatList, StyleSheet, ScrollView,TextInput, TouchableOpacity,  } from 'react-native';
import { Footer } from './Footer';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddDoctor from './AddDoctor';
import { Calendar } from 'react-native-calendars';


export const Calender = ({ onChangeText, onPress,data  }) =>{
    const [selectedDate, setSelectedDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);

    


    return(
      <View>
     
        <View style={styles.container}>
        <View style={styles.containert}>
        <View style={styles.form}> 
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
  style={styles.input}
  onPress={() => setShowCalendar(true)}
/>
  
     </View>
    </View>
    <View>
   
       
    </View>
   
      
    
{/* <TouchableOpacity style={styles.selectButton} onPress={() => setShowCalendar(true)}>
          <Text style={styles.selectButtonText}>Select Date</Text>
        </TouchableOpacity> */}

      
      </View>
      </View>
    );
  }
  const styles = StyleSheet.create({
    containert: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center',
      },
      input1: {
        flex: 1,
        marginRight: 0,
      },
    container: {
      // flexDirection: 'row',
      // alignItems: 'center',
      // backgroundColor: 'white',
      // borderRadius: 5,
      // padding: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
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
    cal:{
width:'100%',
justifyContent:'flex-start',

    },
    form: {
  
      
       backgroundColor:'#fff',
       
     },
     input: {
      
       backgroundColor:'#fff',
       height: 50,
       borderColor: '#d4d4d2',
       borderWidth: 1,
      
       padding: 15,
       marginBottom: 10,
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
    // input: {
    //   flex: 1,
    //   marginRight: 10,
    // },
    selectButtonText: {
      color:'#7a057a',
      flex:1,
      borderRadius: 5,
    },
  });
