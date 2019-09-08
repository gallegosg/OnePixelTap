import React, { Component } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const fontFamily = 'PressStart2P-Regular'

const Locked = ({points}) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.center}>
      <Icon name={'lock'} color={'black'} size={50}/>
      <Text style={styles.text}> Locked </Text>
    </View>
      <Text style={styles.smallText}> Get at least
      <Text style={styles.points}> {points} </Text> 
      points in previous level to unlock</Text>
  </SafeAreaView>
);

export default Locked;

const styles = {
  container: {
    flex: 1,
    backgroudColor: 'white',
    justifyContent: 'center',
  },
  center: {
    flex: 0.3,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    fontFamily,
    fontSize: 30
  },
  smallText: {
    marginHorizontal: 50,
    textAlign: 'center',
    fontFamily,
    fontSize: 12
  },
  points: {
    fontFamily,
    fontSize: 16,
  }
}
