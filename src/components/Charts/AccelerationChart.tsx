import React, { useState, useEffect } from 'react';
import { View, Button, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { accelerometer } from 'react-native-sensors';
import { map, scan, filter, switchMap } from 'rxjs/operators';
import { Subject, interval, of } from 'rxjs';

const { width } = Dimensions.get('window');

interface AccelerationData {
  x: number[];
  y: number[];
  z: number[];
  net: number[];
}

const AccelerationChart = () => {
  const [xData, setXData] = useState<number[]>([]);
  const [yData, setYData] = useState<number[]>([]);
  const [zData, setZData] = useState<number[]>([]);
  const [netData, setNetData] = useState<number[]>([]);
  const [time, setTime] = useState<number[]>([]);
  const [paused, setPaused] = useState<boolean>(false);

  useEffect(() => {
    const dataSubject = new Subject<void>();
    const timeSubject = new Subject<void>();

    const accelerometer$ = accelerometer
      .pipe(
        map(({ x, y, z }) => {
          const net = Math.sqrt(x * x + y * y + z * z);
          // return { x: x, y: y, z: z, net };
          return { x: x * 9.81, y: y * 9.81, z: z * 9.81, net };
        }),

        filter(({ x, y, z, net }) => Math.abs(x) > 0.02 || Math.abs(y) > 0.02 || Math.abs(z) > 0.02 || !paused),
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

  const handlePlayPause = () => {
    setPaused(!paused);
  };

  const chartWidth = width - 20;

  return (
    <View>

      <Text> {xData}</Text>
      <Text> {yData}</Text>
      <Text> {zData}</Text>
      <Text> {netData}</Text>

      <LineChart
        data={{
          labels: time.map((t) => t.toString()),
          datasets: [
            { data: xData, color: (opacity = 1) => `#f00`, strokeWidth: 1.1 }, // Red
            // { data: yData, color: (opacity = 1) => `#0f0`, strokeWidth: 1.1 }, // Green
            // { data: zData, color: (opacity = 1) => `#00f`, strokeWidth: 1.1 }, // Blue
            // { data: netData, color: (opacity = 1) => `rgba(255, 255, 0, ${opacity})`, strokeWidth: 1.1 }, // Yellow
          ],
          legend: ["A-x", "A-y"],
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

export default AccelerationChart;
