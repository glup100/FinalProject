import {Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';

//the intakes for custom button design
const CustomButton = ({onPress, text, type}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, styles[`container_${type}`]]}>
      <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 15,
    marginVertical: 6,
    borderRadius: 15,
  },
  container_MENU: {
    backgroundColor: '#BAE2EC',
    width: '100%',
    
  },
  container_PRIMARY: {
    backgroundColor: '#3B71F3',
    width: '90%',
    
  },
  container_SECONDARY: {
    backgroundColor: '#FFFDFD',
    width: '45%',
    borderWidth: 2, // Add border width
    borderColor: '#40B528', // Add border color
  },
  container_TERTIARY: {
    backgroundColor: '#FFFDFD',
    width: '45%',
    borderWidth: 2, // Add border width
    borderColor: '#DF2D0A', // Add border color
  },
  container_QUATERNARY: {},
  text: {
    fontWeight: 'bold',
    color: 'white',
  },

  text_PRIMARY: {
    color: 'white',
  },
  text_SECONDARY: {
    color: '#40B528',
  },
  text_TERTIARY: {
    color: '#DF2D0A',
  },
  text_QUATERNARY: {
    color: '#A0A0A0',
  },
  text_MENU: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default CustomButton;