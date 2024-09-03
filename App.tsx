import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Bezier } from './src/screens'

const App = () => {
  return (
    <SafeAreaProvider style={styles.appContainer}>
        {/* <Text>This is App Screen</Text> */}
        <Bezier />
    </SafeAreaProvider>
  )
}

export default App

const styles = StyleSheet.create({

  appContainer: {
    padding: 10,
    backgroundColor: 'green',
    flex: 1,
  }

})