import React, { useState, useEffect } from 'react';
import { View, Button, Dimensions, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { accelerometer } from 'react-native-sensors';
import { map, scan, filter, switchMap, throttleTime } from 'rxjs/operators';
import { Subject, interval, of } from 'rxjs';

const { width } = Dimensions.get('window');

// Low-pass filter implementation
const lowPassFilter = (input: number, lastValue: number, alpha: number) => {
  return alpha * input + (1 - alpha) * lastValue;
};

interface AccelerationData {
  x: number[];
  y: number[];
  z: number[];
  net: number[];
}

const AccelerationChart_Smooth = () => {
  const [xData, setXData] = useState<number[]>([]);
  const [yData, setYData] = useState<number[]>([]);
  const [zData, setZData] = useState<number[]>([]);
  const [netData, setNetData] = useState<number[]>([]);
  const [time, setTime] = useState<number[]>([]);
  const [paused, setPaused] = useState<boolean>(false);

  const [currentX, setCurrentX] = useState<number>(0);
  const [currentY, setCurrentY] = useState<number>(0);
  const [currentZ, setCurrentZ] = useState<number>(0);
  const [currentNet, setCurrentNet] = useState<number>(0);

  useEffect(() => {
    const dataSubject = new Subject<void>();
    const timeSubject = new Subject<void>();

    const alpha = 0.5; // Smoothing factor for low-pass filter

    const accelerometer$ = accelerometer
      .pipe(
        map(({ x, y, z }) => {
          // Apply low-pass filter
          const lastX = xData[xData.length - 1] || 0;
          const lastY = yData[yData.length - 1] || 0;
          const lastZ = zData[zData.length - 1] || 0;

          const filteredX = lowPassFilter(x * 9.81, lastX, alpha);
          const filteredY = lowPassFilter(y * 9.81, lastY, alpha);
          const filteredZ = lowPassFilter(z * 9.81, lastZ, alpha);
          const net = Math.sqrt(filteredX * filteredX + filteredY * filteredY + filteredZ * filteredZ);

          return { x: filteredX, y: filteredY, z: filteredZ, net };
        }),

        throttleTime(100), // Throttle data updates
        filter(({ x, y, z }) => Math.abs(x) > 0.2 || Math.abs(y) > 0.2 || Math.abs(z) > 0.2 || !paused),

        scan<{ x: number, y: number, z: number, net: number }, AccelerationData>(
          (acc, { x, y, z, net }) => {
            return {
              x: [...acc.x, x].slice(-15),
              y: [...acc.y, y].slice(-15),
              z: [...acc.z, z].slice(-15),
              net: [...acc.net, net].slice(-15),
            };
          },
          { x: [], y: [], z: [], net: [] }
        )
      )
      .subscribe(({ x, y, z, net }) => {
        setXData(x);
        setYData(y);
        setZData(z);
        setNetData(net);
      });

    const timeSubscription = timeSubject
      .pipe(
        switchMap(() =>
          paused ? of(0) : interval(1000)
        ),
        scan((acc, curr) => paused ? acc : acc + 1, 0)
      )
      .subscribe((t) => {
        setTime((prev) => {
          const newTime = [...prev, t];
          if (newTime.length > 15) {
            newTime.shift();
          }
          return newTime;
        });
      });

    return () => {
      accelerometer$.unsubscribe();
      timeSubscription.unsubscribe();
      dataSubject.complete();
      timeSubject.complete();
    };
  }, [paused]);
  // }, [paused, xData, yData, zData, netData]);

  const handlePlayPause = () => {
    setPaused(!paused);
  };

  const chartWidth = width - 20;

  return (
    <View>

      <LineChart
        data={{
          labels: time.map((t) => t.toString()),
          datasets: [
            { data: xData, color: (opacity = 1) => `#f00`, strokeWidth: 1.1 }, // Red
            // { data: yData, color: (opacity = 1) => `#0f0`, strokeWidth: 1.1 }, // Green
            { data: zData, color: (opacity = 1) => `#00f`, strokeWidth: 1.1 }, // Blue
            // { data: netData, color: (opacity = 1) => `rgba(255, 255, 0, ${opacity})`, strokeWidth: 1.1 }, // Yellow
          ],
        }}

        bezier
        withShadow={false}
        withInnerLines={false}
        withDots={false}
        fromZero={true}
        width={chartWidth} // from react-native
        height={400}
        yAxisInterval={10} // optional, defaults to 1
        yLabelsOffset={25}
        xLabelsOffset={10}

        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          fillShadowGradient: '#fff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16, },
          propsForVerticalLabels: { fontSize: 10, },
          propsForHorizontalLabels: { fontSize: 10, },
          strokeWidth: 2,
          useShadowColorFromDataset: false,
          propsForBackgroundLines: {
            stroke: '#e3e3e3',
            strokeWidth: 1,
          }
        }}

        style={{
          marginVertical: 20,
          borderWidth: 1,
        }}
      />

      <Button onPress={handlePlayPause} title={paused ? 'Play' : 'Pause'} />
    </View>
  );
};

export default AccelerationChart_Smooth;

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    color: 'black',
  }
});
