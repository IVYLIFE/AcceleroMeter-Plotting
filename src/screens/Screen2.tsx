import { StyleSheet, Text, View } from 'react-native'
import { genericStyles } from '../utils'
import { AccelerometerChart, AccelerometerDataProvider } from '../components'

const Screen4 = () => {
  return (
    <View style={genericStyles.screenContainer}>
      <Text style={genericStyles.screenHeading}> Accelerometer Chart [ Screen-4 ] </Text>

      <AccelerometerDataProvider>
        {(data, time, acceleration, paused, handlePlayPause) => (
          <AccelerometerChart
            data={data}
            time={time}
            acceleration={acceleration}
            paused={paused}
            handlePlayPause={handlePlayPause}
          />
        )}
      </AccelerometerDataProvider>
    </View>
  )
}

export default Screen4

const styles = StyleSheet.create({

})