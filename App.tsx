import React from 'react'
import { StyleSheet} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Screen0, Screen1, Screen2 } from './src/screens'

const App = () => {
  return (
    <SafeAreaProvider style={styles.appContainer}>
      <Screen0/>
      {/* <Screen1/> */}
      {/* <Screen2/> */}
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


// "victory-native": "^37.0.3-next.0"
