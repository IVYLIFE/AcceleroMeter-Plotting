import { StyleSheet, Text, View } from 'react-native'
import { VictoryGraph } from '../components'
import { genericStyles } from '../utils'


const Screen0 = () => {
  return (
    <View style = {genericStyles.screenContainer} >
      <Text style = {genericStyles.screenHeading} >This is Bezier Screen</Text>
      <VictoryGraph/>
    </View>
  )
}

export default Screen0

const styles = StyleSheet.create({
})