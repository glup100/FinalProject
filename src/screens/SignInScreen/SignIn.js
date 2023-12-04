import { View, Text, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native'
import React, { useState } from 'react'
import Logo from '/Project/Project/assets/images/logo.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButtons/CustomButton';
import { useNavigation} from '@react-navigation/native';
import { auth } from '../../../firebase';


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

const SignIn = () => {

    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');

    const navigation = useNavigation();

    const handleSignIn = () => {
        auth.signInWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('logged in with', user.email);
            navigation.navigate('Home');            
        })
        .catch(error => alert(error.message))
    }


    

    //makes responsive for differentdevice sizes
    const {height} = useWindowDimensions();

    //for the buttons
    const onSignIn = () =>{
       

        navigation.navigate('Home');
    }

    const onForgotPassword = () =>{
        console.warn("Forgot Password");
    }

    const onSignup = () =>{
      

        navigation.navigate('SignUp');
    }


  return (
    <View style = {styles.homebackground}>
<ScrollView showsVerticalScrollIndicator={false} >
    <View style = {styles.root}>
      <Image source = {Logo} style = {[styles.Logo, {height: height * 0.3}]} resizeMode="contain" />

{     /* sends to textvalue in custominput.js */}
      <CustomInput placeholder="Email" value={email} setValue={setEmail} />
      <CustomInput placeholder="password" value={password} setValue={setPassword} secureTextEntry={true}/>

       {/* <CustomButton text="Sign In" onPress={onSignIn} type="PRIMARY"/> go back and check the consts above */}
       <CustomButton text="Sign In" onPress={handleSignIn} type="PRIMARY"/>
<View style = {styles.signUpView}>
<View style = {styles.signUp}>
       <CustomButton text="Dont have an account? Sign Up HERE" onPress={onSignup} type="QUATERNARY"/>
</View>
</View>
    </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    root: {
      alignItems: 'center',
      justifyContent: 'center', 
      flex: 1, 
      padding: 20,
      backgroundColor: '#DFF9FF',
      paddingTop: 80,
    },
    homebackground:{
        flex:1,
        backgroundColor: '#DFF9FF',
        
    },
    Logo: {
      width: '60%',
      maxWidth: 300,
      height: '60%',
      maxHeight: 200,
    },
signUpView: {
flex: 1,
justifyContent: 'flex-end',
},
    signUp: {
      alignSelf: 'center', // Center the signUp element horizontally
  paddingBottom: 0, // Add padding to the bottom for spacing
      
    }
  });

export default SignIn