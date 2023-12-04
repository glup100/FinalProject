import { View, Text,  StyleSheet, useWindowDimensions, ScrollView } from 'react-native'
import React, { useState } from 'react'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButtons/CustomButton';
import { useNavigation} from '@react-navigation/native';
import { auth, db } from '../../../firebase';




const SignUp = () => {

    // const [username, setUsername]= useState('');
    const [email, setEmail]= useState('');
    const [password, setPassword]= useState('');    
    const [username, setUsername]= useState('');    
    // const [confirmpassword, setConfirmPassword] = useState('');

    const navigation = useNavigation();

    //makes responsive for differentdevice sizes
    const {height} = useWindowDimensions();

    const handleSignUp = () => { 

        // 
        auth.createUserWithEmailAndPassword(  email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            const userUid = user.uid;
            console.log('here i am', userUid )
            

            // navigation.navigate('EventCard', { eventData: item, });
            navigation.navigate('AccessCode', { username, email, userUid} );
            
    
})
    }


    //for the buttons
    

    const onSignup = () =>{
        console.warn("Sign Up");


        navigation.navigate('SignIn');

    }

    const onRegister = () =>{
        console.warn("Registering");

        navigation.navigate('Home');
    }


  return (
<ScrollView showsVerticalScrollIndicator={false} style = {styles.container}>
    <View style = {styles.root}>
     <Text style= {styles.title}>Create an Account</Text>

{     /* sends to textvalue in custominput.js */}
      {/* <CustomInput placeholder="username" value={username} setValue={setUsername} onChangeText={text => setUsername(text)}/>  */}
      <CustomInput placeholder="full name" value={username} setValue={setUsername} onChangeText={text => setUsername (text)}/>
      <CustomInput placeholder="email" value={email} setValue={setEmail} onChangeText={text => setEmail (text)}/>
      <CustomInput placeholder="password" value={password} setValue={setPassword} onChangeText={text => setPassword (text)} secureTextEntry={true}/>
      {/* <CustomInput placeholder="confirmpassword" value={confirmpassword} setValue={setConfirmPassword} onChangeText={text => setConfirmPassword (text)} secureTextEntry={true}/> */}

       <CustomButton text="Register" onPress={handleSignUp} type="PRIMARY"/>

      

       <CustomButton text="Already have an account? Sign In HERE" onPress={onSignup} type="QUATERNARY"/>

    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DFF9FF'
        
      },
    root: {
        alignItems: 'center',
        padding: 20,
        
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

});

export default SignUp