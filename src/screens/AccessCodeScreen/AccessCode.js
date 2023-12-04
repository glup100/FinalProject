import { View, Text, StyleSheet } from 'react-native'
import { auth, db } from '../../../firebase';
import React, { useState } from 'react'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButtons/CustomButton';
import { useNavigation} from '@react-navigation/native';

const AccessCode = ({route}) => {

  const accessCodeData = route.params
  console.log(route.params)
  console.log(accessCodeData.email)
  console.log(accessCodeData.userUid)

  const [accessCode, setaccessCode]= useState('');

  const navigation = useNavigation();

  const handleJoinTeam = () => {            

    const user_email = accessCodeData.email
    const userUid = accessCodeData.userUid;
    const username = accessCodeData.username;

    

            postUserDataToFirestore(user_email, userUid, accessCode, username)
            .then(() => {
                console.log('User data added to Firestore successfully');

                // Navigate to the 'AccessCode' screen
                navigation.navigate("Home")
            })
            .catch(error => {
                console.error('Error adding user data to Firestore:', error);
                // You might want to handle the error here, e.g., display an error message.
            });      
      
    }
  

    const postUserDataToFirestore = (email, uid, accessCode, username) => {
      return new Promise((resolve, reject) => {
          
  
          // Define the collection where you want to store the user data
          const usersCollection = db.collection('Users');
  
          // Add the user data to the collection with a document ID same as the user's UID
          usersCollection.doc(uid).set({
              user_email: email,
              uid: uid,
              access_code: accessCode,
              user_name: username
              // You can add more fields here if needed
          })
          .then(() => {
              // Resolve the Promise if the data is successfully posted to Firestore
              resolve();
          })
          .catch(error => {
              // Reject the Promise if there's an error while posting data to Firestore
              reject(error);
          });
      });
  }


  return (
    <View style = {styles.container}>
      <Text style={styles.title}>Welcome : {auth.currentUser?.email}</Text>
      <Text style={styles.title}>Please enter your access code below to join your team!</Text>

      <View style={styles.buttonContainer}>
      <CustomInput placeholder="Access Code" value={{accessCode}} setValue={setaccessCode} />
      </View>

      <View style={styles.buttonContainer}>
      <CustomButton text="Join Team" onPress={handleJoinTeam} type="PRIMARY"/>
      </View>
    </View>

    
  )

  
}
const styles = StyleSheet.create({
    
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#DFF9FF'
        
      },buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingHorizontal: 20,
        paddingTop: 10,
        justifyContent: 'center', // Center vertically
        alignItems: 'center',
        
      },
    

});

export default AccessCode