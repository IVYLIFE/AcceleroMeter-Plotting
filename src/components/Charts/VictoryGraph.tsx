import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { VictoryChart, VictoryTheme, VictoryLine } from "victory-native";

import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";
import { map } from "rxjs/operators";
import { Subscription } from "rxjs";

import { genericStyles } from "../../utils"

const { width } = Dimensions.get('window');


const MAX_DATA_POINTS = 50;
const INTERVAL = 100;
const CHART_WIDTH = width + 20;

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  net: number;
}

const VictoryGraph: React.FC = () => {

  const [acceleration, setAcceleration] = useState<AccelerometerData>({
    x: 0,
    y: 0,
    z: 0,
    net: 0
  });

  const [accelerationData, setAccelerationData] = useState<{ x: number; y: number }[]>([]);

  let subscription: Subscription | undefined;
  let time = 0;

  useEffect(() => {

    setUpdateIntervalForType(SensorTypes.accelerometer, INTERVAL); // defaults to 100ms

    // Subscribe to accelerometer data and calculate net acceleration
    subscription = accelerometer
      .pipe(
        map(({ x, y, z }) => {

          const currentTime = Date.now();

          // Identify the axis with the maximum value (aligned with gravity)
          let calibratedX = x;
          let calibratedY = y;
          let calibratedZ = z;

          if (Math.abs(x) > Math.abs(y) && Math.abs(x) > Math.abs(z)) {
            calibratedX = x - Math.sign(x) * 9.81;
          } else if (Math.abs(y) > Math.abs(x) && Math.abs(y) > Math.abs(z)) {
            calibratedY = y - Math.sign(y) * 9.81;
          } else {
            calibratedZ = z - Math.sign(z) * 9.81;
          }

          const net = Math.sqrt(
            calibratedX * calibratedX +
            calibratedY * calibratedY +
            calibratedZ * calibratedZ
          );

          return {
            x: parseFloat(calibratedX.toFixed(2)),
            y: parseFloat(calibratedY.toFixed(2)),
            z: parseFloat(calibratedZ.toFixed(2)),
            net: parseFloat(net.toFixed(2))
          };
        })
      )
      .subscribe(
        (data: AccelerometerData) => {
          setAcceleration(data);
          time += 1; // Increment time
          setAccelerationData(prevData => [
            ...prevData.slice(-MAX_DATA_POINTS + 1), // Keep only the latest MAX_DATA_POINTS
            { x: time, y: data.x }
          ]);
        },
        (error: any) => {
          console.log("The sensor is not available", error);
        }
      );

    // Cleanup subscription on component unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);


  return (
    <View style={styles.container}>
      <Text style={genericStyles.heading2}>Victory Graph</Text>
      
      <VictoryChart
        width={CHART_WIDTH}
        theme={VictoryTheme.material}
        style={{
          parent: { marginLeft: -10 },
          // background: { fill: "#ff0" }
        }}
      >
        <VictoryLine
          interpolation="natural"
          data={accelerationData}
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #000" }
          }}
          domain={{ y: [-20, 20] }}
          range={{ x: [0, 15] }}
        />

      </VictoryChart>

      {/* Display acceleration values */}
      <View style={styles.accelerationValueContainer} >
        <Text style={genericStyles.normalText}> X: </Text>
        <Text style={genericStyles.normalText}> {acceleration.x} m/s² </Text>
      </View>
      <View style={styles.accelerationValueContainer} >
        <Text style={genericStyles.normalText}> Y: </Text>
        <Text style={genericStyles.normalText}> {acceleration.y} m/s² </Text>
      </View>
      <View style={styles.accelerationValueContainer} >
        <Text style={genericStyles.normalText}> Z: </Text>
        <Text style={genericStyles.normalText}> {acceleration.z} m/s² </Text>
      </View>
      <View style={styles.accelerationValueContainer} >
        <Text style={genericStyles.normalText}> Net: </Text>
        <Text style={genericStyles.normalText}> {acceleration.net} m/s² </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5fcff"
  },

  text: {
    color: 'black',
  },

  accelerationValueContainer: {
    borderLeftWidth: 1,
    borderLeftColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
    marginBottom: 1,
    marginLeft: 60,
  },

  accelerationText: {
    color: "black",
    fontSize: 16,
  },


})

export default VictoryGraph;