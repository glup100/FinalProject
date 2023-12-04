import { View, Text, StyleSheet,  useWindowDimensions, ScrollView, TouchableOpacity, StatusBar  } from 'react-native'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButtons/CustomButton';
import { useNavigation} from '@react-navigation/native';
import { auth, db } from '../../../firebase';
import { Agenda } from 'react-native-calendars';
import { Avatar, Card } from 'react-native-paper';
import { Appbar, Menu, Provider } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import firestore from "@react-native-firebase/firestore";

 //for the calendar
 const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
}

//to return event data
const fetchMatch = async () => {
  const userRef = db.collection('Events');
  const querySnapshot = await userRef.get();

  const usersData = [];
  querySnapshot.forEach((doc) => {
    usersData.push(doc.data());
  });
  return usersData;
}

//to return current user data
const fetchCurrentUser = async () => {
  const userRef = db.collection('Users');
  const querySnapshot = await userRef.get();

  const usersData = [];
  querySnapshot.forEach((doc) => {
    usersData.push(doc.data());
  });
  return usersData;
}
fetchMatch().then((allUsersData) => {
  // console.log(allUsersData, "fetch");
  
  // console.log("Edited");
  
});

const Home = () => {

   //for the appbar
  // Declare a state variable to track the visibility of the menu
  const [isMenuVisible, setMenuVisible] = useState(false);

  // Function to handle menu item selection
  const handleMenuPress = () => setMenuVisible(true);
  
  // Function to handle menu dismissal
  const handleMenuDismiss = () => setMenuVisible(false);
  
  const navigation = useNavigation();  

  const handleSignOut = () => {
    auth.signOut()
    .then(() => {
      navigation.replace("SignIn")
    })
    .catch(error => alert(error.message))
  }

  const handleResponses = () =>{
    navigation.navigate("Responses")
  }

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };
  //setting the 'items' ideally want to retrieve events from the firestore
  const [items, setItems] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the authenticated user's email
        const userEmail = auth.currentUser?.email;
        const allUsers = await fetchCurrentUser();
        setData(allUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      const currentUserAccessCode = data.find(
        (item) => item.user_email === auth.currentUser?.email
      )?.access_code;

      // Assuming fetchMatch is defined
      const fetchData = async () => {
        try {
          const allUsersData = await fetchMatch();

          // Assuming 'arrival_time' and 'start_time' are Firebase Timestamp objects
          const updatedItems = allUsersData.reduce((acc, curr) => {
            const { name, arrival_time, start_time, venue, type, access_code } = curr;

            // Arrival time date and time
            const dateKey = arrival_time.toDate().toISOString().slice(0, 10);
            const arrive = arrival_time.toDate().toISOString().slice(11, 16);

            // Throw-In date and time
            const startTime = start_time.toDate().toISOString().slice(11, 16);

            if (currentUserAccessCode === access_code) {
              if (acc[dateKey]) {
                acc[dateKey].push({ name, dateKey, arrive, venue, startTime, type, access_code });
              } else {
                acc[dateKey] = [{ name, dateKey, arrive, venue, startTime, type, access_code }];
              }
            }

            return acc;
          }, {});

          setItems(updatedItems);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [data]);

  // Render loading indicator 
  if (Object.keys(items).length === 0) {
    
  }     

    const renderItem = (item, currentUserAccessCode)  => {

      // if(currentUserAccessCode != 'null' && currentUserAccessCode === item.access_code){
      //separate matches and training for design
      
      if (item.type === 'match'){
      return(<TouchableOpacity style={styles.item} onPress={() => {    

        navigation.navigate('EventCard', { eventData: item, });       
           
    }} activeOpacity={0.8}>
                 <Card style={styles.matchcard}>
                 <Card.Content>
        <View style={styles.card}>
            <View style={styles.textContainer}>
            <Text>{item.type}</Text>
                <Text>Venue            :   {item.venue}</Text>
                <Text>Arrival Time  :  {item.arrive}</Text>
                <Text>Start Time     :  {item.startTime}</Text>  
                 
                                       
                {/* <Text>{item.dateKey}</Text>                 */}
            </View>
            <View style={styles.avatarContainer}>
                <Avatar.Text label='GL' backgroundColor="#fcc729" />
            </View>
        </View>
                     </Card.Content>
                 </Card>
             </TouchableOpacity>             
             )
            }
            else {
              if (item.type === 'training'){
                return(<TouchableOpacity style={styles.item} onPress={() => {    
          
                  navigation.navigate('EventCard', { eventData: item, });       
                     
              }} activeOpacity={0.8}>
                           <Card style={styles.trainingcard}>
                           <Card.Content>
                  <View style={styles.card}>
                      <View>
                      <Text>{item.type}</Text> 
                          <Text>Venue            :   {item.venue}</Text>
                          <Text>Arrival Time  :  {item.arrive}</Text>
                          <Text>Start Time     :  {item.startTime}</Text>  
                           
                                                 
                          {/* <Text>{item.dateKey}</Text>                 */}
                      </View>
                      <View style={styles.avatarContainer}>
                          <Avatar.Text label='GL' backgroundColor="#9fafca" />
                      </View>
                  </View>
                               </Card.Content>
                           </Card>
                       </TouchableOpacity>             
                       )
                      }
            }
                    
    };   

    
  return (
  <Provider>
    <View style={styles.container}>

{/* App Bar */}
       <Appbar.Header>
      <Text style={styles.title}>Welcome back: {auth.currentUser?.email}</Text>
      
    <Menu
    visible={isMenuVisible}
    onDismiss={handleMenuDismiss}
    anchor={<Appbar.Action icon="menu" onPress={handleMenuPress} />}
    >
    
    <Menu.Item onPress={() => {}} title="Account" />
    <Menu.Item onPress={handleResponses} title="Responses" />
    <Menu.Item onPress={handleSignOut} title="Sign Out" />
    </Menu>
    </Appbar.Header>

{/* This is the calendar */}
      <Agenda
       
        items={items}
        renderItem={renderItem}      
        
      />
    </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 30,

    },
    Logo: {
        width: '60%',
        maxWidth: 300,
        height: '60%',
        maxHeight: 200,
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10,
    },
    container: {
      flex: 1,
      
      
  },
  item: {
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 10,
          
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    
},
avatarContainer: {
  flexShrink: 0, 
},
trainingcard:{
  backgroundColor: '#337def',
  borderWidth: 1,
  borderColor: '#ADAFB5',
  
},
matchcard: {
  backgroundColor: '#22A7E1',
  borderWidth: 1,
  borderColor: '#ADAFB5',
}

});

export default Home