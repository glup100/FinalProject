"use strict";
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Node} from 'react';
import '@react-native-firebase/app';

//Screnn Imports
import SignIn from './src/screens/SignInScreen/SignIn';
import SignUp from './src/screens/SignUpScreen/SignUp';
import Navigation from './src/navigation';



import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';


exports.__esModule = true;
var react_1 = require("react");
var react_native_1 = require("react-native");
var NewAppScreen_1 = require("react-native/Libraries/NewAppScreen");

const App = () => {
    
    return (
      <SafeAreaView style ={styles.root}>
        <Navigation />
      </SafeAreaView>
    );
};           
    

const styles = react_native_1.StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: '#F9FBFC',
    }
});
exports["default"] = App;
