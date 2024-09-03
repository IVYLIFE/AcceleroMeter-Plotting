import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AccelerationChart, AccelerationChart_Smooth, BezierLine } from '../components'

const Bezier = () => {
  return (
    <View style = {styles.screenContainer} >
      <Text style = {styles.screenHeading} >This is Bezier Screen</Text>
      <View style = {styles.seperator} ></View>
      
      <BezierLine />
      <View style = {styles.seperator} ></View>

      {/* <AccelerationChart/> */}
      <AccelerationChart_Smooth/>
    </View>
  )
}

export default Bezier

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor : 'white',
    flex : 1,
  },

  screenHeading : {
    fontSize : 20,
    fontWeight : 'bold',
    textAlign : 'center',
    color : 'black',
  },

  seperator : {
    marginVertical : 10
  }
})